// Runs a proof against a level. Shared by POST /api/evaluate and the real-time battles.
import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { isSolved, Level } from "../frontend/src/data/levels";
import { BusyError, createLimiter } from "./limiter";
import { EvalError, makeBoard, parseLeanOutput, parseProgram, PuzzleError, runMock, Step, toLean } from "./engine";

// ts source: backend/proof.ts; compiled: backend/dist/backend/proof.js. LEAN_DIR overrides both.
const LEAN_DIR =
  process.env.LEAN_DIR ??
  [path.resolve(__dirname, "..", "lean-project"), path.resolve(__dirname, "..", "..", "..", "lean-project")].find((d) => fs.existsSync(d)) ??
  path.resolve(__dirname, "..", "lean-project");

// LEAN_SANDBOX=docker runs every proof in its own throwaway container (see docker/lean.Dockerfile) instead of calling
// `lake` directly on the host. The limits below are the defaults; each can be overridden with the env var of that name.
const SANDBOX = process.env.LEAN_SANDBOX === "docker";
const num = (name: string, fallback: number) => (Number(process.env[name]) > 0 ? Number(process.env[name]) : fallback);
const LEAN_SECONDS = num("LEAN_TIMEOUT_S", 15);
/** at most this many proofs run at once, and this many more may wait: the rest are turned away */
const limiter = createLimiter(num("LEAN_MAX_PARALLEL", 2), num("LEAN_MAX_QUEUE", 8));

export let leanAvailable = false;
execFile(SANDBOX ? "docker" : "lake", ["--version"], (err) => {
  leanAvailable = !err && process.env.USE_LEAN !== "0";
  console.log(`Engine: ${leanAvailable ? (SANDBOX ? "Lean 4 in a Docker sandbox" : "Lean 4 (lake env lean --run)") : "mock Node.js parser"}`);
});

/**
 * The command that checks `file` (a Lean source inside its own directory). In sandbox mode that is `docker run` with no
 * network, a memory and CPU cap, a process cap, a read-only filesystem, no capabilities and a hard kill after LEAN_SECONDS.
 */
export function leanInvocation(file: string, sandbox = SANDBOX, leanDir = LEAN_DIR): { cmd: string; args: string[]; cwd?: string; timeoutMs: number } {
  if (!sandbox) return { cmd: "lake", args: ["env", "lean", "--run", file], cwd: leanDir, timeoutMs: 20000 };
  const image = process.env.LEAN_DOCKER_IMAGE ?? "swappr-lean";
  return {
    cmd: "docker",
    args: [
      "run", "--rm",
      "--network", "none",
      "--memory", "1g", "--memory-swap", "1g",
      "--cpus", "1",
      "--pids-limit", "64",
      "--read-only", "--tmpfs", "/tmp:rw,size=64m",
      "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
      "-v", `${path.dirname(file)}:/proof:ro`, // only the proof is mounted: the Lean project is baked into the image
      "-w", "/work",
      image,
      "timeout", "-s", "KILL", String(LEAN_SECONDS),
      "lake", "env", "lean", "--run", `/proof/${path.basename(file)}`,
    ],
    timeoutMs: (LEAN_SECONDS + 5) * 1000,
  };
}

const runLean = (file: string) =>
  limiter.run(
    () =>
      new Promise<string>((resolve) => {
        const { cmd, args, cwd, timeoutMs } = leanInvocation(file);
        execFile(cmd, args, { cwd, timeout: timeoutMs }, (err, stdout, stderr) =>
          resolve(stdout + (err ? `\nERROR 0  ${stderr || err.message}` : "")),
        );
      }),
  );

export interface ProofResult {
  engine: "lean" | "mock";
  /** one entry per executed command, with the command itself so the UI can sonify the replay */
  steps: Step[];
  error: EvalError | null;
  solved: boolean;
  linesUsed: number;
  message: string;
}

/** Compiles and runs `code`. Syntax errors, par overruns and illegal moves come back in `error`, not as exceptions. */
export async function evaluateProof(level: Level, code: string): Promise<ProofResult> {
  const engine = leanAvailable && !level.locked?.length ? "lean" : "mock";
  let tmp: string | undefined;
  try {
    // Throws PuzzleError for syntax errors and for scripts longer than the par limit.
    const { ops, statementLines } = parseProgram(code, level.parLimit);
    // Always materialise the Lean program in a temp file, as the pipeline describes.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "proof-puzzle-"));
    tmp = path.join(dir, "Proof.lean");
    fs.writeFileSync(tmp, toLean(level, ops));
    // the Lean library knows nothing about locked blocks, so levels that have them are judged by the TypeScript engine
    const useLean = leanAvailable && !level.locked?.length;
    const result = useLean ? parseLeanOutput(await runLean(tmp)) : { ...runMock(level, ops), valid: undefined };
    const steps = result.steps.map((s, i) => ({ ...s, op: ops[i] && { name: ops[i].name, args: ops[i].args } }));

    const final = steps.length ? steps[steps.length - 1].board : makeBoard(level.initialState);
    // With Lean the win condition is whatever Lean's `isValid` printed; the mock evaluates the same predicate in TS.
    const solved = !result.error && (result.valid ?? isSolved(level, final));
    const message = result.error
      ? result.error.message
      : solved
        ? "QED. Nicely done."
        : level.property
          ? "It runs, but the theorem does not hold for this board yet."
          : "It runs, but the board is not the target yet. Keep going.";
    return { engine, steps, error: result.error ?? null, solved, linesUsed: statementLines, message };
  } catch (e) {
    if (e instanceof BusyError) {
      return { engine, steps: [], error: { line: 0, message: e.message, cells: [] }, solved: false, linesUsed: 0, message: e.message };
    }
    if (!(e instanceof PuzzleError)) throw e;
    return {
      engine,
      steps: [],
      error: { line: e.line, message: e.message, cells: e.cells },
      solved: false,
      linesUsed: 0,
      message: e.message,
    };
  } finally {
    if (tmp) fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
  }
}
