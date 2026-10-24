import http from "http";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { customToLevel, decodeCustom, encodeCustom, Level, LEVELS, levelKey, validateCustom } from "../frontend/src/data/levels";
import { computeScore, countLines, HINT_POINTS, HINT_TIME_MS } from "../frontend/src/data/scoring";
import {
  addFriend, addHint, dailyByLevelKey, dailyCompletion, friendNames, insertUser, leaderboard, pauseSession, recordDailyCompletion, recordSolve, saveCustomLevel, sessionOf,
  setPasswordHash, startSession, User, userByName, userRowByName,
} from "./db";
import { attachBattles } from "./battle";
import { checkPassword, clearFailures, dummyPasswordCheck, hashPassword, MAX_PASSWORD_BYTES, passwordProblem, recordFailure, signToken, tooManyFailures, verifyToken } from "./auth";
import { corsOrigin, publicBaseUrl } from "./config";
import { boardAfter, previewLine, PuzzleError } from "./engine";
import { findHint } from "./hint";
import { todaysDaily } from "./daily";
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
// Two routes, matching the Sign In / Sign Up toggle in the UI. Both take { username, password } (`name` is accepted
// as an old alias for `username`) and answer with a JWT.
const BAD_LOGIN = "Wrong username or password.";

function readUsername(body: { username?: unknown; name?: unknown } | undefined): string | null {
  const raw = body?.username ?? body?.name;
  const username = typeof raw === "string" ? raw.trim() : "";
  return /^[\w-]{2,20}$/.test(username) ? username : null;
}
const USERNAME_RULE = "Usernames are 2-20 characters: letters, digits, _ or -";

app.post("/api/register", async (req, res) => {
  const username = readUsername(req.body);
  if (!username) return void res.status(400).json({ error: USERNAME_RULE });
  const problem = passwordProblem(req.body?.password);
  if (problem) return void res.status(400).json({ error: problem });

  // every attempt counts, so one address cannot mass-register accounts
  const guardKey = `register|${req.ip}`;
  if (tooManyFailures(guardKey)) return void res.status(429).json({ error: "Too many sign-up attempts. Wait a few minutes and try again." });
  recordFailure(guardKey);

  if (userRowByName(username)) return void res.status(409).json({ error: "That username is taken. Pick another, or switch to Sign In." });
  try {
    const user = insertUser(username, await hashPassword(req.body.password as string));
    res.status(201).json({ name: user.name, token: signToken(user), created: true });
  } catch {
    // someone registered the same name between the lookup and the insert
    res.status(409).json({ error: "That username was just taken. Pick another." });
  }
});

app.post("/api/login", async (req, res) => {
  const username = readUsername(req.body);
  const password: unknown = req.body?.password;
  if (!username) return void res.status(400).json({ error: USERNAME_RULE });
  if (typeof password !== "string" || password.length === 0 || Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
    return void res.status(400).json({ error: "Enter your password." });
  }

  const guardKey = `${req.ip}|${username.toLowerCase()}`;
  if (tooManyFailures(guardKey)) return void res.status(429).json({ error: "Too many failed attempts. Wait a few minutes and try again." });

  const row = userRowByName(username);
  // an account from before passwords existed has no hash yet: signing in once sets the password
  if (row && !row.passwordHash) {
    const problem = passwordProblem(password);
    if (problem) return void res.status(400).json({ error: `${problem} This account predates passwords: choose the password you want to use from now on.` });
    setPasswordHash(row.id, await hashPassword(password));
    return void res.json({ name: row.name, token: signToken(row), created: false, claimed: true });
  }
  const ok = row?.passwordHash ? await checkPassword(password, row.passwordHash) : (await dummyPasswordCheck(password), false);
  if (!row || !ok) {
    recordFailure(guardKey);
    return void res.status(401).json({ error: BAD_LOGIN });
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

// ---- the daily is a one-shot: the first valid proof (any length) uses up the day's attempt --------------
const LOCKED_MESSAGE = "You already completed this daily theorem. One valid proof per day: come back after 00:00 UTC for the next one.";

/** If `level` is one of the generated daily puzzles: which one, and whether `user` has already completed it. */
function dailyLock(level: Level, user?: User) {
  const daily = dailyByLevelKey(levelKey(level));
  if (!daily) return null;
  return { daily, completion: user ? dailyCompletion(user.id, daily.date) : undefined };
}

// ---- level clock ----------------------------------------------------------------------
app.post("/api/sessions/start", (req, res) => {
  const user = requireUser(req, res);
  const level = user && levelFrom(req, res);
  if (!user || !level) return;
  if (dailyLock(level, user)?.completion) return void res.status(409).json({ locked: true, error: LOCKED_MESSAGE });
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
  if (dailyLock(level, user)?.completion) return void res.status(409).json({ locked: true, error: { message: LOCKED_MESSAGE } });
  if (!sessionOf(user.id, levelKey(level))) return void res.status(409).json({ error: { message: "Start the level first" } });
  const board = boardAfter(level, String(req.body.code ?? ""));
  const hint = findHint(level, board);
  if (!hint) return void res.json({ hint: null, message: "Nothing to suggest: the board already satisfies the target." });
  // The penalty is only charged when there was a hint to give.
  const hints = addHint(user.id, levelKey(level));
  res.json({ hint, hints, penalty: { points: HINT_POINTS, timeMs: HINT_TIME_MS }, solver: leanAvailable ? "lean" : "heuristic" });
});

// ---- Daily Theorem -------------------------------------------------------------------------------------
// One generated puzzle per UTC day (see daily.ts). It reaches the browser as a custom-level payload and is played
// like one; the server recognises it by its level key to enforce the one-valid-proof-per-day rule.
app.get("/api/daily", (req, res) => {
  const d = todaysDaily();
  const c = req.user ? dailyCompletion(req.user.id, d.date) : undefined;
  res.json({
    date: d.date,
    number: d.number,
    level: d.payload,
    // the signed-in player's result for today, if they have already used their attempt
    completion: c
      ? { lines: c.lines, optimalLines: c.optimal_lines, points: c.points, canRevealSolution: c.lines > c.optimal_lines }
      : null,
  });
});

/**
 * The shortest proof (from the BFS solver in puzzleGenerator.ts) for today's puzzle. Only players who have already
 * completed it with a longer proof than the optimum may see it: it is the "Show Optimal Solution" reveal.
 */
app.get("/api/daily/solution", (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;
  const d = todaysDaily();
  const c = dailyCompletion(user.id, d.date);
  if (!c) return void res.status(403).json({ error: "Complete today's daily first: the optimal proof is only shown afterwards." });
  if (c.lines <= c.optimal_lines) return void res.status(403).json({ error: "Your proof was already as short as the optimum, so there is nothing to reveal." });
  res.json({ date: d.date, number: d.number, optimalLines: d.optimal_lines, yourLines: c.lines, solution: d.solution });
});

// ---- evaluation ---------------------------------------------------------------------------
app.post("/api/evaluate", async (req, res) => {
  const level = levelFrom(req, res);
  if (!level) return;
  const { code } = req.body;
  if (typeof code !== "string") return void res.status(400).json({ error: { line: 0, message: "Bad request", cells: [] } });
  const lock = dailyLock(level, req.user);
  if (lock?.completion) {
    return void res.status(409).json({
      locked: true, engine: "mock", steps: [], solved: false, linesUsed: 0, score: null,
      error: { line: 0, message: LOCKED_MESSAGE, cells: [] }, message: LOCKED_MESSAGE,
    });
  }
  try {
    const result = await evaluateProof(level, code);
    let score = null;
    if (result.solved && req.user) {
      const key = levelKey(level);
      const lines = countLines(code);
      // A score needs a started level: the server clock is the only time source.
      const session = sessionOf(req.user.id, key);
      const computed = session ? computeScore({ optimalLines: level.optimalLines, lines, elapsedMs: session.elapsedMs, hints: session.hints }) : null;
      // On a daily, the first valid proof (whatever its length) uses up the attempt. If another request got there
      // first, this one is refused and scores nothing.
      if (lock && !recordDailyCompletion(req.user.id, lock.daily.date, lines, lock.daily.optimal_lines, computed?.total ?? null, session?.elapsedMs ?? null)) {
        return void res.status(409).json({
          locked: true, engine: "mock", steps: [], solved: false, linesUsed: 0, score: null,
          error: { line: 0, message: LOCKED_MESSAGE, cells: [] }, message: LOCKED_MESSAGE,
        });
      }
      if (computed && session) {
        score = Object.assign(computed, recordSolve(req.user.id, key, lines, session.elapsedMs, session.hints, computed), { elapsedMs: session.elapsedMs });
      }
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
server.listen(PORT, () => console.log(`Swappr backend listening on port ${PORT}`));
