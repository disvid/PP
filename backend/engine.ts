import { Block, Board, COLORS, Constraint, Level } from "../frontend/src/data/levels";

export type { Block, Board };
export interface Step { line: number; board: Board; op?: { name: Op["name"]; args: string[] } }
export interface EvalError { line: number; message: string; cells: [number, number][] }
export interface Op { name: "swap" | "paint" | "rotate"; args: string[]; line: number }

export const PAR_ERROR = "Proof too long. Use a helper macro.";
const ARITY: Record<string, number> = { swap: 4, paint: 3, rotate: 2 };
const MAX_MACRO_PARAMS = 6;
const MAX_MACRO_BODY = 4;

export class PuzzleError extends Error {
  constructor(message: string, public line: number, public cells: [number, number][] = []) {
    super(message);
  }
}

interface Stmt { name: string; args: string[] }
interface Macro { params: string[]; body: Stmt[] }

const CALL = /^([A-Za-z_]\w*)\s*\(([^()]*)\)$/;
const DEF = /^def\s+([A-Za-z_]\w*)\s*\(([^()]*)\)\s*:=\s*(.+)$/;
const IDENT = /^[A-Za-z_]\w*$/;
const splitArgs = (s: string) => (s.trim() === "" ? [] : s.split(",").map((a) => a.trim()));

function parseCall(text: string, line: number): Stmt {
  const m = CALL.exec(text.trim());
  if (!m) throw new PuzzleError(`Syntax error: cannot parse \`${text.trim()}\``, line);
  return { name: m[1], args: splitArgs(m[2]) };
}

/**
 * Parse the source, enforce the par limit, expand macros, and return a flat list of primitive ops.
 *
 * Rules that keep "lines of code" a meaningful budget:
 *  - blank lines and `--` comments are free, everything else is a line;
 *  - a top-level line holds exactly one command (`;` is only for macro bodies);
 *  - a macro is one `def` line with at most 4 swap/paint/rotate commands, no number literals
 *    (coordinates must be parameters) and no calls to other macros.
 */
export function parseProgram(code: string, parLimit: number): { ops: Op[]; statementLines: number } {
  const macros = new Map<string, Macro>();
  const ops: Op[] = [];
  let statementLines = 0;

  const emit = (st: Stmt, env: Record<string, string>, line: number) => {
    const args = st.args.map((a) => (a in env ? env[a] : a));
    if (st.name in ARITY) {
      if (args.length !== ARITY[st.name])
        throw new PuzzleError(`${st.name} expects ${ARITY[st.name]} arguments, got ${args.length}`, line);
      const numeric = st.name === "paint" ? args.slice(0, 2) : args;
      for (const a of numeric)
        if (!/^\d+$/.test(a)) throw new PuzzleError(`Expected a natural number, got \`${a}\``, line);
      if (st.name === "paint" && !(COLORS as string[]).includes(args[2]))
        throw new PuzzleError(`Unknown color \`${args[2]}\` (try ${COLORS.join(", ")})`, line);
      ops.push({ name: st.name as Op["name"], args, line });
      return;
    }
    const macro = macros.get(st.name);
    if (!macro) throw new PuzzleError(`Unknown command \`${st.name}\``, line);
    if (args.length !== macro.params.length)
      throw new PuzzleError(`${st.name} expects ${macro.params.length} arguments, got ${args.length}`, line);
    const inner: Record<string, string> = {};
    macro.params.forEach((p, i) => (inner[p] = args[i]));
    for (const b of macro.body) emit(b, inner, line);
  };

  code.split("\n").forEach((raw, i) => {
    const line = i + 1;
    const text = raw.split("--")[0].trim();
    if (!text) return;
    statementLines++;
    if (statementLines > parLimit) throw new PuzzleError(PAR_ERROR, line);

    const d = DEF.exec(text);
    if (d) {
      const [, name, rawParams, body] = d;
      if (name in ARITY || macros.has(name)) throw new PuzzleError(`\`${name}\` is already defined`, line);
      const params = splitArgs(rawParams);
      if (params.some((p) => !IDENT.test(p)) || new Set(params).size !== params.length)
        throw new PuzzleError("Invalid macro parameter list", line);
      if (params.length > MAX_MACRO_PARAMS)
        throw new PuzzleError(`A macro can take at most ${MAX_MACRO_PARAMS} parameters`, line);
      const stmts = body.split(";").filter((s) => s.trim()).map((s) => parseCall(s, line));
      if (stmts.length > MAX_MACRO_BODY)
        throw new PuzzleError(`A macro can hold at most ${MAX_MACRO_BODY} commands`, line);
      for (const s of stmts) {
        if (!(s.name in ARITY)) throw new PuzzleError("Macros can only use swap, paint and rotate", line);
        if (s.args.some((a) => /^\d+$/.test(a)))
          throw new PuzzleError("Macro bodies cannot contain number literals; pass coordinates as parameters", line);
      }
      macros.set(name, { params, body: stmts });
      return;
    }
    const parts = text.split(";").filter((s) => s.trim());
    if (parts.length > 1) throw new PuzzleError("One command per line (`;` is only for macro bodies)", line);
    emit(parseCall(parts[0], line), {}, line);
  });
  return { ops, statementLines };
}

const clone = (b: Board): Board => b.map((r) => r.map((c) => ({ ...c })));
export const makeBoard = clone;
const inBounds = (b: Board, x: number, y: number) => y >= 0 && y < b.length && x >= 0 && x < b[0].length;

/** Apply one op (mock of the Lean `Puzzle.apply`). Throws PuzzleError on an illegal move. */
export function applyOp(board: Board, op: Op): Board {
  const n = op.args.map(Number);
  const b = clone(board);
  const check = (...pts: [number, number][]) => {
    const bad = pts.filter(([x, y]) => !inBounds(b, x, y));
    if (bad.length)
      throw new PuzzleError(
        `Illegal move: (${bad[0][0]}, ${bad[0][1]}) is outside the ${b[0].length}x${b.length} board`,
        op.line,
        pts.filter(([x, y]) => inBounds(b, x, y)),
      );
  };
  if (op.name === "swap") {
    check([n[0], n[1]], [n[2], n[3]]);
    const t = b[n[1]][n[0]];
    b[n[1]][n[0]] = b[n[3]][n[2]];
    b[n[3]][n[2]] = t;
  } else if (op.name === "paint") {
    check([n[0], n[1]]);
    b[n[1]][n[0]].color = op.args[2] as Block["color"];
  } else {
    check([n[0], n[1]]);
    const blk = b[n[1]][n[0]];
    if (blk.rot === undefined)
      throw new PuzzleError(`Illegal move: block (${n[0]}, ${n[1]}) has no direction to rotate`, op.line, [[n[0], n[1]]]);
    blk.rot = ((blk.rot + 1) % 4) as Block["rot"];
  }
  return b;
}

export function runMock(level: Level, ops: Op[]): { steps: Step[]; error?: EvalError } {
  let board = makeBoard(level.initialState);
  const steps: Step[] = [];
  for (const op of ops) {
    try {
      board = applyOp(board, op);
      steps.push({ line: op.line, board, op: { name: op.name, args: op.args } });
    } catch (e) {
      if (e instanceof PuzzleError) return { steps, error: { line: e.line, message: e.message, cells: e.cells } };
      throw e;
    }
  }
  return { steps };
}

const leanBool = (c: Constraint): string => {
  switch (c.kind) {
    case "noAdjacent": return `noAdjacent b "${c.color}"`;
    case "count": return `countColor b "${c.color}" == ${c.n}`;
    case "rowsUniform": return "rowsUniform b";
    case "symmetricH": return "symmetricH b";
  }
};

/**
 * Generate the Lean 4 program that replays the ops against the `Puzzle` library and then evaluates
 * the level's win condition (`isValid`) inside Lean.
 */
export function toLean(level: Level, ops: Op[]): string {
  const lit = (o: Op) => {
    const a = o.args;
    if (o.name === "swap") return `.swap ${a.join(" ")}`;
    if (o.name === "paint") return `.paint ${a[0]} ${a[1]} "${a[2]}"`;
    return `.rotate ${a[0]} ${a[1]}`;
  };
  const cell = (b: Block) => `("${b.color}", ${b.rot === undefined ? "none" : `some ${b.rot}`})`;
  const rows = (b: Board) => b.map((r) => `#[${r.map(cell).join(", ")}]`).join(", ");
  const checks: string[] = [];
  if (level.targetState) checks.push(`b == Puzzle.ofCells #[${rows(level.targetState)}]`);
  if (level.property) checks.push(...level.property.constraints.map(leanBool));
  return [
    "import Puzzle",
    "open Puzzle",
    "",
    `def ops : List (Nat × Op) := [${ops.map((o) => `(${o.line}, ${lit(o)})`).join(", ")}]`,
    "",
    `def isValid (b : Board) : Bool := ${checks.join(" && ") || "true"}`,
    "",
    `def main : IO Unit := runChecked (Puzzle.ofCells #[${rows(level.initialState)}]) ops isValid`,
    "",
  ].join("\n");
}

/** Parse `STEP <line> <board>` / `ERROR <line> <cells> <msg>` lines printed by the Lean program. */
export function parseLeanOutput(out: string): { steps: Step[]; error?: EvalError; valid?: boolean } {
  const steps: Step[] = [];
  const valid = /^VALID (true|false)$/m.exec(out)?.[1];
  const parseBlock = (s: string): Block => {
    const [color, rot] = s.split(":");
    return rot === "-" ? { color: color as Block["color"] } : { color: color as Block["color"], rot: Number(rot) as Block["rot"] };
  };
  for (const l of out.split(/\r?\n/)) {
    const s = /^STEP (\d+) (.*)$/.exec(l);
    if (s) steps.push({ line: Number(s[1]), board: s[2].split(";").map((r) => r.split(",").map(parseBlock)) });
    const e = /^ERROR (\d+) ([\d,|]*) (.*)$/.exec(l);
    if (e)
      return {
        steps,
        error: {
          line: Number(e[1]),
          message: e[3],
          cells: e[2] ? e[2].split("|").map((p) => p.split(",").map(Number) as [number, number]) : [],
        },
      };
  }
  return { steps, valid: valid === undefined ? undefined : valid === "true" };
}

// ---- editor "ghost" previews ------------------------------------------------
export interface Change { x: number; y: number; before: Block; after: Block }

export const diffBoards = (a: Board, b: Board): Change[] =>
  b.flatMap((row, y) =>
    row.flatMap((after, x) =>
      a[y][x].color === after.color && a[y][x].rot === after.rot ? [] : [{ x, y, before: a[y][x], after }],
    ),
  );

const describe = (o: Op) => {
  const [a, b, c, d] = o.args;
  if (o.name === "swap") return `swap (${a}, ${b}) ↔ (${c}, ${d})`;
  if (o.name === "paint") return `paint (${a}, ${b}) → ${c}`;
  return `rotate (${a}, ${b}) a quarter turn clockwise`;
};

/**
 * What would hovering `line` do? Runs everything above the line, then only that line's ops, and
 * reports the cells that change. Lines below are ignored so a typo further down cannot break the preview.
 */
export function previewLine(level: Level, code: string, line: number) {
  const { ops } = parseProgram(code.split("\n").slice(0, line).join("\n"), Infinity);
  let board = makeBoard(level.initialState);
  for (const op of ops) {
    if (op.line >= line) break;
    board = applyOp(board, op);
  }
  const here = ops.filter((o) => o.line === line);
  let after = board;
  for (const op of here) after = applyOp(after, op);
  return {
    before: board,
    after,
    changed: diffBoards(board, after),
    text: here.length ? here.map(describe).join("\n") : "",
  };
}

/** Board after running as much of `code` as is legal (used by the hint solver). */
export function boardAfter(level: Level, code: string): Board {
  try {
    const { ops } = parseProgram(code, Infinity);
    const { steps } = runMock(level, ops);
    return steps.length ? steps[steps.length - 1].board : makeBoard(level.initialState);
  } catch {
    return makeBoard(level.initialState);
  }
}
