import http from "http";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { customToLevel, decodeCustom, encodeCustom, Level, LEVELS, levelKey, validateCustom } from "../frontend/src/data/levels";
import { computeScore, countLines, HINT_POINTS, HINT_TIME_MS } from "../frontend/src/data/scoring";
import {
  addFriend, addHint, friendNames, insertUser, leaderboard, pauseSession, recordSolve, saveCustomLevel, sessionOf,
  setPasswordHash, startSession, User, userByName, userRowByName,
} from "./db";
import { attachBattles } from "./battle";
import { checkPassword, clearFailures, hashPassword, passwordProblem, recordFailure, signToken, tooManyFailures, verifyToken } from "./auth";
import { corsOrigin, publicBaseUrl } from "./config";
import { boardAfter, previewLine, PuzzleError } from "./engine";
import { findHint } from "./hint";
import { generatePuzzle } from "./puzzleGenerator";
import { evaluateProof, leanAvailable } from "./proof";

declare module "express-serve-static-core" {
  interface Request { user?: User }
}

const app = express();
app.use(cors({ origin: corsOrigin }));
// behind a hosting proxy (Render, Fly, ...) req.ip must be the client's address, not the proxy's
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

// ---- helpers ------------------------------------------------------------------
/** Optional auth: `Authorization: Bearer <token>` attaches req.user when valid. */
app.use((req: Request, _res: Response, next: NextFunction) => {
  const m = /^Bearer ([\w.-]+)$/.exec(req.header("authorization") ?? "");
  if (m) req.user = verifyToken(m[1]);
  next();
});
const requireUser = (req: Request, res: Response): User | null => {
  if (!req.user) res.status(401).json({ error: "Sign in first" });
  return req.user ?? null;
};

/** A level is either a built-in `levelId` or a user-made `custom` payload (base64url). */
function resolveLevel(body: { levelId?: unknown; custom?: unknown }): Level {
  if (typeof body.custom === "string") return customToLevel(decodeCustom(body.custom));
  const level = LEVELS.find((l) => l.id === body.levelId);
  if (!level) throw new Error("Unknown level");
  return level;
}
const levelFrom = (req: Request, res: Response): Level | null => {
  try {
    return resolveLevel(req.body ?? {});
  } catch (e) {
    res.status(400).json({ error: { line: 0, message: e instanceof Error ? e.message : "Bad request", cells: [] } });
    return null;
  }
};
const publicUrl = (req: Request) => publicBaseUrl(req.header("origin"));

// liveness probe for the container / hosting platform
app.get("/api/health", (_req, res) => void res.json({ ok: true }));

// ---- accounts: username + password (bcrypt), sessions are signed JWTs ----------------------------------
// One endpoint for both: an unknown username registers a new account with the given password, a known one must
// present its password. Accounts made before passwords existed have no hash yet, and the first sign-in claims them.
app.post("/api/login", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const password: unknown = req.body?.password;
  if (!/^[\w-]{2,20}$/.test(name)) return void res.status(400).json({ error: "Usernames are 2-20 characters: letters, digits, _ or -" });
  const problem = passwordProblem(password);
  if (problem) return void res.status(400).json({ error: problem });
  const pw = password as string;

  const guardKey = `${req.ip}|${name.toLowerCase()}`;
  if (tooManyFailures(guardKey)) return void res.status(429).json({ error: "Too many failed attempts. Wait a few minutes and try again." });

  const row = userRowByName(name);
  if (!row) {
    try {
      const user = insertUser(name, await hashPassword(pw));
      return void res.json({ name: user.name, token: signToken(user), created: true });
    } catch {
      // someone registered the same name between the lookup and the insert
      return void res.status(409).json({ error: "That username was just taken. Try signing in again." });
    }
  }
  if (!row.passwordHash) {
    setPasswordHash(row.id, await hashPassword(pw));
    return void res.json({ name: row.name, token: signToken(row), created: false, claimed: true });
  }
  if (!(await checkPassword(pw, row.passwordHash))) {
    recordFailure(guardKey);
    return void res.status(401).json({ error: "That username exists, but the password does not match." });
  }
  clearFailures(guardKey);
  res.json({ name: row.name, token: signToken(row), created: false });
});

app.get("/api/me", (req, res) => {
  const user = requireUser(req, res);
  if (user) res.json({ name: user.name, friends: friendNames(user.id) });
});

app.post("/api/friends", (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;
  const friend = userByName(String(req.body?.name ?? "").trim());
  if (!friend) return void res.status(404).json({ error: "No such player" });
  if (friend.id === user.id) return void res.status(400).json({ error: "You cannot add yourself" });
  addFriend(user.id, friend.id);
  res.json({ friends: friendNames(user.id) });
});

// ---- leaderboards -----------------------------------------------------------------
app.get("/api/leaderboard/global", (req, res) => {
  const level = typeof req.query.level === "string" ? req.query.level : undefined;
  res.json(leaderboard(undefined, level));
});

app.get("/api/leaderboard/friends", (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;
  const ids = [user.id, ...friendNames(user.id).map((n) => userByName(n)!.id)];
  const level = typeof req.query.level === "string" ? req.query.level : undefined;
  res.json(leaderboard(ids, level));
});

// ---- level clock ----------------------------------------------------------------------
app.post("/api/sessions/start", (req, res) => {
  const user = requireUser(req, res);
  const level = user && levelFrom(req, res);
  if (!user || !level) return;
  res.json(startSession(user.id, levelKey(level)));
});

app.post("/api/sessions/pause", (req, res) => {
  const user = requireUser(req, res);
  const level = user && levelFrom(req, res);
  if (!user || !level) return;
  res.json(pauseSession(user.id, levelKey(level)) ?? { elapsedMs: 0, hints: 0 });
});

// ---- level builder --------------------------------------------------------------------
app.post("/api/custom-levels", (req, res) => {
  try {
    const payload = validateCustom(req.body);
    const b64 = encodeCustom(payload);
    const level = customToLevel(payload);
    const id = levelKey(level);
    saveCustomLevel(id, req.user?.id ?? null, payload.title, JSON.stringify(payload));
    res.json({ id, level: b64, url: `${publicUrl(req)}/?level=${b64}` });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Bad level" });
  }
});

// ---- ghost previews (what would this line do?) ---------------------------------------------
app.post("/api/preview", (req, res) => {
  const level = levelFrom(req, res);
  if (!level) return;
  const { code, line } = req.body;
  if (typeof code !== "string" || !Number.isInteger(line) || line < 1) return void res.status(400).json({ error: "Bad request" });
  try {
    res.json(previewLine(level, code, line));
  } catch (e) {
    if (e instanceof PuzzleError) return void res.json({ error: { line: e.line, message: e.message } });
    throw e;
  }
});

// ---- hints ------------------------------------------------------------------------------
app.post("/api/hint", (req, res) => {
  const user = requireUser(req, res);
  const level = user && levelFrom(req, res);
  if (!user || !level) return;
  if (!sessionOf(user.id, levelKey(level))) return void res.status(409).json({ error: { message: "Start the level first" } });
  const board = boardAfter(level, String(req.body.code ?? ""));
  const hint = findHint(level, board);
  if (!hint) return void res.json({ hint: null, message: "Nothing to suggest: the board already satisfies the target." });
  // The penalty is only charged when there was a hint to give.
  const hints = addHint(user.id, levelKey(level));
  res.json({ hint, hints, penalty: { points: HINT_POINTS, timeMs: HINT_TIME_MS }, solver: leanAvailable ? "lean" : "heuristic" });
});

// ---- Daily Theorem: one generated puzzle per UTC day, identical for every player ------------------------
// The generator is seeded with the date, so the puzzle needs no storage: any server instance, at any time that day,
// produces the same board. It reaches the browser as a custom-level payload and is played (and scored) like one.
const DAILY_EPOCH = Date.UTC(2026, 0, 1); // puzzle #1
let dailyCache: { date: string; number: number; level: string } | null = null;

app.get("/api/daily", (_req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  if (dailyCache?.date !== date) {
    const [y, m, d] = date.split("-").map(Number);
    const number = Math.floor((Date.UTC(y, m - 1, d) - DAILY_EPOCH) / 86_400_000) + 1;
    dailyCache = { date, number, level: generatePuzzle(`proof-puzzle-daily-${date}`, `Daily Theorem #${number}`).payload };
  }
  res.json(dailyCache);
});

// ---- evaluation ---------------------------------------------------------------------------
app.post("/api/evaluate", async (req, res) => {
  const level = levelFrom(req, res);
  if (!level) return;
  const { code } = req.body;
  if (typeof code !== "string") return void res.status(400).json({ error: { line: 0, message: "Bad request", cells: [] } });
  try {
    const result = await evaluateProof(level, code);
    let score = null;
    // A score needs a started level: the server clock is the only time source.
    const session = req.user ? sessionOf(req.user.id, levelKey(level)) : undefined;
    if (result.solved && req.user && session) {
      const lines = countLines(code);
      score = computeScore({ optimalLines: level.optimalLines, lines, elapsedMs: session.elapsedMs, hints: session.hints });
      Object.assign(score, recordSolve(req.user.id, levelKey(level), lines, session.elapsedMs, session.hints, score), {
        elapsedMs: session.elapsedMs,
      });
    }
    res.json({ ...result, score });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { line: 0, message: "Internal error", cells: [] } });
  }
});

const PORT = Number(process.env.PORT || 3000);
const server = http.createServer(app);
attachBattles(server);
server.listen(PORT, () => console.log(`Proof Puzzle backend listening on port ${PORT}`));
