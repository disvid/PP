// Passwords (bcrypt) and sessions (signed JWTs).
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, userById } from "./db";

const PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Signing key for session tokens. Set JWT_SECRET in production (see .env.example). If it is missing there, a random
 * key is generated for this process: nothing is insecure, but every restart signs everybody out (and a second
 * instance would reject the first one's tokens). Development uses a fixed key so that restarting the dev server
 * does not log you out.
 */
const SECRET =
  process.env.JWT_SECRET ??
  (PRODUCTION ? crypto.randomBytes(32).toString("hex") : "dev-only-insecure-secret-do-not-use-in-production");
if (PRODUCTION && !process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set: using a random key, sessions will not survive a restart.");
}

const TOKEN_TTL = "30d";

export const signToken = (user: User) => jwt.sign({ name: user.name }, SECRET, { subject: String(user.id), expiresIn: TOKEN_TTL, algorithm: "HS256" });

/** The user a token belongs to, or undefined for a missing, forged or expired token (or a deleted user). */
export function verifyToken(token: string): User | undefined {
  try {
    const payload = jwt.verify(token, SECRET, { algorithms: ["HS256"] });
    const id = Number(typeof payload === "object" ? payload.sub : NaN);
    return Number.isInteger(id) ? userById(id) : undefined;
  } catch {
    return undefined;
  }
}

// ---- passwords --------------------------------------------------------------------------------
export const MIN_PASSWORD = 8;
/** bcrypt only looks at the first 72 bytes, so longer passwords would silently be truncated: refuse them instead. */
export const MAX_PASSWORD_BYTES = 72;

export function passwordProblem(password: unknown): string | null {
  if (typeof password !== "string") return "A password is required.";
  if (password.length < MIN_PASSWORD) return `Passwords need at least ${MIN_PASSWORD} characters.`;
  if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) return `Passwords can be at most ${MAX_PASSWORD_BYTES} bytes long.`;
  return null;
}

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const checkPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

// ---- brute-force guard: failed sign-ins per (ip, alias) in a sliding window ------------------------------
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 8;
const failures = new Map<string, number[]>();

const recent = (key: string) => {
  const now = Date.now();
  const list = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length) failures.set(key, list);
  else failures.delete(key);
  return list;
};
export const tooManyFailures = (key: string) => recent(key).length >= MAX_FAILURES;
export const recordFailure = (key: string) => void failures.set(key, [...recent(key), Date.now()]);
export const clearFailures = (key: string) => void failures.delete(key);
