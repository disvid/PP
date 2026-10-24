// SQLite through Node's built-in `node:sqlite` (no native module to compile).
import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { LEVELS } from "../frontend/src/data/levels";
import { computeScore } from "../frontend/src/data/scoring";
import type { Score } from "../frontend/src/data/scoring";

// DB_PATH points at the SQLite file (in Docker: a file on a mounted volume); the default is backend/data/.
const DB_FILE = process.env.DB_PATH ?? path.resolve(__dirname, "data", "proof-puzzle.db");
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
export const db = new DatabaseSync(DB_FILE);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    token TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL
  );
  -- derived from frontend/src/data/levels.ts on every start
  DROP TABLE IF EXISTS levels;
  CREATE TABLE levels (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    par_limit INTEGER NOT NULL,
    optimal_lines INTEGER NOT NULL
  );
  -- one row per (user, level): the best result so far
  CREATE TABLE IF NOT EXISTS scores (
    user_id INTEGER NOT NULL REFERENCES users(id),
    level_key TEXT NOT NULL,
    lines INTEGER NOT NULL,
    time_ms INTEGER NOT NULL,
    hints INTEGER NOT NULL,
    optimality INTEGER NOT NULL,
    time_points INTEGER NOT NULL,
    points INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, level_key)
  );
  CREATE TABLE IF NOT EXISTS custom_levels (
    id TEXT PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS friends (
    user_id INTEGER NOT NULL REFERENCES users(id),
    friend_id INTEGER NOT NULL REFERENCES users(id),
    PRIMARY KEY (user_id, friend_id)
  );
  -- server-side clock: counts only while the level is open on the Game view (pausable), so the
  -- client cannot fake its time. Closing the tab without pausing keeps the clock running.
  DROP TABLE IF EXISTS sessions;
  CREATE TABLE IF NOT EXISTS play_sessions (
    user_id INTEGER NOT NULL REFERENCES users(id),
    level_key TEXT NOT NULL,
    elapsed_ms INTEGER NOT NULL DEFAULT 0,
    running_since INTEGER,
    hints INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, level_key)
  );
`);

const insertLevel = db.prepare("INSERT INTO levels (id, title, par_limit, optimal_lines) VALUES (?, ?, ?, ?)");
for (const l of LEVELS) insertLevel.run(l.id, l.title, l.parLimit, l.optimalLines);

// Migration v2: scoring now compares against optimalLines instead of par. Existing rows keep their
// lines/time/hints and are re-scored with the new formula, so no results are lost.
if ((db.prepare("PRAGMA user_version").get() as { user_version: number }).user_version < 2) {
  const cols = (db.prepare("PRAGMA table_info(scores)").all() as { name: string }[]).map((c) => c.name);
  if (cols.includes("golf")) db.exec("ALTER TABLE scores RENAME COLUMN golf TO optimality");
  const optimalOf = (key: string): number | null => {
    const built = LEVELS.find((l) => String(l.id) === key);
    if (built) return built.optimalLines;
    const row = db.prepare("SELECT payload FROM custom_levels WHERE id = ?").get(key) as { payload: string } | undefined;
    if (!row) return null;
    const p = JSON.parse(row.payload) as { par: number; optimal?: number };
    return p.optimal ?? p.par;
  };
  const rows = db.prepare("SELECT user_id, level_key, lines, time_ms, hints FROM scores").all() as {
    user_id: number; level_key: string; lines: number; time_ms: number; hints: number
  }[];
  const upd = db.prepare("UPDATE scores SET optimality = ?, time_points = ?, points = ? WHERE user_id = ? AND level_key = ?");
  for (const r of rows) {
    const optimalLines = optimalOf(r.level_key);
    if (optimalLines === null) continue;
    const s = computeScore({ optimalLines, lines: r.lines, elapsedMs: r.time_ms, hints: r.hints });
    upd.run(s.optimality, s.time, s.total, r.user_id, r.level_key);
  }
  db.exec("PRAGMA user_version = 2");
}

export interface User { id: number; name: string }

const q = {
  userByToken: db.prepare("SELECT id, name FROM users WHERE token = ?"),
  userByName: db.prepare("SELECT id, name FROM users WHERE name = ?"),
  userRow: db.prepare("SELECT id, name, token FROM users WHERE name = ?"),
  insertUser: db.prepare("INSERT INTO users (name, token, created_at) VALUES (?, ?, ?)"),
  getSession: db.prepare("SELECT elapsed_ms, running_since, hints FROM play_sessions WHERE user_id = ? AND level_key = ?"),
  newSession: db.prepare("INSERT INTO play_sessions (user_id, level_key, elapsed_ms, running_since, hints) VALUES (?, ?, 0, ?, 0)"),
  resume: db.prepare("UPDATE play_sessions SET running_since = ? WHERE user_id = ? AND level_key = ? AND running_since IS NULL"),
  pause: db.prepare(
    "UPDATE play_sessions SET elapsed_ms = elapsed_ms + (? - running_since), running_since = NULL WHERE user_id = ? AND level_key = ? AND running_since IS NOT NULL",
  ),
  addHint: db.prepare("UPDATE play_sessions SET hints = hints + 1 WHERE user_id = ? AND level_key = ?"),
  endSession: db.prepare("DELETE FROM play_sessions WHERE user_id = ? AND level_key = ?"),
  getScore: db.prepare("SELECT points FROM scores WHERE user_id = ? AND level_key = ?"),
  putScore: db.prepare(
    `INSERT OR REPLACE INTO scores (user_id, level_key, lines, time_ms, hints, optimality, time_points, points, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ),
  addFriend: db.prepare("INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)"),
  friendsOf: db.prepare("SELECT u.name FROM friends f JOIN users u ON u.id = f.friend_id WHERE f.user_id = ? ORDER BY u.name"),
  putCustom: db.prepare("INSERT OR IGNORE INTO custom_levels (id, creator_id, title, payload, created_at) VALUES (?, ?, ?, ?, ?)"),
};

export const userByToken = (token: string) => q.userByToken.get(token) as User | undefined;
export const userByName = (name: string) => q.userByName.get(name) as User | undefined;

/** Returns the user's token if the name exists (a returning player), otherwise registers the name. */
export function loginOrCreate(name: string): { user: User; token: string; created: boolean } {
  const existing = q.userRow.get(name) as (User & { token: string }) | undefined;
  if (existing) return { user: { id: existing.id, name: existing.name }, token: existing.token, created: false };
  return { ...createUser(name), created: true };
}

export function createUser(name: string): { user: User; token: string } {
  const token = crypto.randomBytes(24).toString("hex");
  const r = q.insertUser.run(name, token, Date.now());
  return { user: { id: Number(r.lastInsertRowid), name }, token };
}

interface SessionRow { elapsed_ms: number; running_since: number | null; hints: number }
const elapsedOf = (s: SessionRow) => s.elapsed_ms + (s.running_since ? Date.now() - s.running_since : 0);
const view = (s: SessionRow) => ({ elapsedMs: elapsedOf(s), hints: s.hints });
const getSession = (userId: number, key: string) => q.getSession.get(userId, key) as SessionRow | undefined;

/** Start a level's clock, or resume it where it was paused. Called when the player clicks "Start Level". */
export function startSession(userId: number, key: string) {
  if (!getSession(userId, key)) q.newSession.run(userId, key, Date.now());
  else q.resume.run(Date.now(), userId, key);
  return view(getSession(userId, key)!);
}

export function pauseSession(userId: number, key: string) {
  q.pause.run(Date.now(), userId, key);
  const s = getSession(userId, key);
  return s ? view(s) : null;
}

/** Charges a hint to the running session; null when the level was never started. */
export function addHint(userId: number, key: string): number | null {
  if (!getSession(userId, key)) return null;
  q.addHint.run(userId, key);
  return getSession(userId, key)!.hints;
}

export const sessionOf = (userId: number, key: string) => {
  const s = getSession(userId, key);
  return s ? view(s) : undefined;
};

/** Record a solve: keeps the best result per level and ends the session. */
export function recordSolve(userId: number, key: string, lines: number, timeMs: number, hints: number, s: Score) {
  const prev = q.getScore.get(userId, key) as { points: number } | undefined;
  const improved = !prev || s.total > prev.points;
  if (improved) q.putScore.run(userId, key, lines, timeMs, hints, s.optimality, s.time, s.total, Date.now());
  q.endSession.run(userId, key);
  return { improved, best: improved ? s.total : prev!.points };
}

export function addFriend(userId: number, friendId: number) {
  q.addFriend.run(userId, friendId);
}
export const friendNames = (userId: number) => (q.friendsOf.all(userId) as { name: string }[]).map((r) => r.name);

export function saveCustomLevel(id: string, creatorId: number | null, title: string, payload: string) {
  q.putCustom.run(id, creatorId, title, payload, Date.now());
}

export interface BoardRow { rank: number; name: string; points: number; optimality: number; speed: number; solved: number }

/** Total points (best per level: base + optimality + speed - hints), optionally restricted to some users. */
export function leaderboard(userIds?: number[], levelKey?: string, limit = 20): BoardRow[] {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (userIds) {
    if (!userIds.length) return [];
    where.push(`s.user_id IN (${userIds.map(() => "?").join(",")})`);
    args.push(...userIds);
  }
  if (levelKey) {
    where.push("s.level_key = ?");
    args.push(levelKey);
  }
  const rows = db
    .prepare(
      `SELECT u.name AS name, SUM(s.points) AS points, SUM(s.optimality) AS optimality, SUM(s.time_points) AS speed, COUNT(*) AS solved
       FROM scores s JOIN users u ON u.id = s.user_id
       ${where.length ? "WHERE " + where.join(" AND ") : ""}
       GROUP BY s.user_id ORDER BY points DESC, solved DESC, name LIMIT ?`,
    )
    .all(...args, limit) as Omit<BoardRow, "rank">[];
  return rows.map((r, i) => ({ rank: i + 1, ...r }));
}
