// Runs a proof against a level. Shared by POST /api/evaluate and the real-time battles.
import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { isSolved, Level } from "../frontend/src/data/levels";
import { EvalError, makeBoard, parseLeanOutput, parseProgram, PuzzleError, runMock, Step, toLean } from "./engine";

// ts source: backend/proof.ts; compiled: backend/dist/backend/proof.js. LEAN_DIR overrides both.
const LEAN_DIR =
  process.env.LEAN_DIR ??
  [path.resolve(__dirname, "..", "lean-project"), path.resolve(__dirname, "..", "..", "..", "lean-project")].find((d) => fs.existsSync(d)) ??
  path.resolve(__dirname, "..", "lean-project");

export let leanAvailable = false;
execFile("lake", ["--version"], (err) => {
  leanAvailable = !err && process.env.USE_LEAN !== "0";
  console.log(`Engine: ${leanAvailable ? "Lean 4 (lake env lean --run)" : "mock Node.js parser"}`);
});

const runLean = (file: string) =>
  new Promise<string>((resolve) =>
    execFile("lake", ["env", "lean", "--run", file], { cwd: LEAN_DIR, timeout: 20000 }, (err, stdout, stderr) =>
      resolve(stdout + (err ? `\nERROR 0  ${stderr || err.message}` : "")),
    ),
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
  const engine = leanAvailable ? "lean" : "mock";
  let tmp: string | undefined;
  try {
    // Throws PuzzleError for syntax errors and for scripts longer than the par limit.
    const { ops, statementLines } = parseProgram(code, level.parLimit);
    // Always materialise the Lean program in a temp file, as the pipeline describes.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "proof-puzzle-"));
    tmp = path.join(dir, "Proof.lean");
    fs.writeFileSync(tmp, toLean(level, ops));
    const result = leanAvailable ? parseLeanOutput(await runLean(tmp)) : { ...runMock(level, ops), valid: undefined };
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
