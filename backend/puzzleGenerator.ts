// Procedural puzzles: scramble a board with random valid moves, keep the result as the target, and measure the
// shortest proof. Seeded, so the same seed always yields the same puzzle (the Daily Theorem seeds it with the date,
// battles with a fresh random seed, and scripts/generate-levels.ts with the level number).
import { Block, Board, boardToRows, COLORS, Color, CustomPayload, customToLevel, Level } from "../frontend/src/data/levels";
import { applyOp, Op, PuzzleError } from "./engine";
import { Move, solveSequence } from "./hint";

// ---- seeded random numbers (xmur3 string hash -> mulberry32) -----------------------------------------------
export interface Rng {
  /** float in [0, 1) */
  next(): number;
  /** integer in [0, n) */
  int(n: number): number;
  pick<T>(items: readonly T[]): T;
}

export function makeRng(seed: string): Rng {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
  let a = (h ^= h >>> 16) >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return { next, int: (n) => Math.floor(next() * n), pick: (items) => items[Math.floor(next() * items.length)] };
}

// ---- generating boards ----------------------------------------------------------------------------------
export interface GenOptions {
  size: 3 | 4 | 5;
  /** inclusive range for how many random transformations are applied */
  ops: [number, number];
  /** how many distinct colors the starting board uses */
  colors: number;
  /** inclusive range for how many arrow blocks it contains (rotate needs at least one) */
  arrows: [number, number];
}

export interface Generated {
  initial: Board;
  target: Board;
  /** the random transformations that produced the target */
  scramble: Move[];
  /** a shortest single-block proof (what the optimum is measured against) */
  solution: Move[];
  /** length of `solution`: the best known proof length, helpers can only improve on it */
  optimalLines: number;
  parLimit: number;
}

const toOp = (m: Move): Op => ({ ...m, line: 0 });
const sameBlock = (a: Block, b: Block) => a.color === b.color && a.rot === b.rot;

function randomBoard(rng: Rng, o: GenOptions): Board {
  const palette: Color[] = [...COLORS];
  for (let i = palette.length - 1; i > 0; i--) {
    const j = rng.int(i + 1);
    [palette[i], palette[j]] = [palette[j], palette[i]];
  }
  const colors = palette.slice(0, Math.min(o.colors, palette.length));
  const board: Board = Array.from({ length: o.size }, () => Array.from({ length: o.size }, () => ({ color: rng.pick(colors) }) as Block));
  const arrows = o.arrows[0] + rng.int(o.arrows[1] - o.arrows[0] + 1);
  const cells = board.flatMap((row, y) => row.map((_, x) => [x, y] as const));
  for (let i = 0; i < arrows; i++) {
    const [x, y] = cells.splice(rng.int(cells.length), 1)[0];
    board[y][x] = { color: board[y][x].color, rot: rng.int(4) as 0 | 1 | 2 | 3 };
  }
  return board;
}

/** One random transformation that really changes the board, or null if the dice found none this time. */
function randomMove(rng: Rng, board: Board, colors: Color[]): Move | null {
  const size = board.length;
  const cell = () => [rng.int(size), rng.int(size)] as const;
  const roll = rng.next();
  if (roll < 0.4) {
    const [x1, y1] = cell();
    const [x2, y2] = cell();
    if (sameBlock(board[y1][x1], board[y2][x2])) return null;
    return { name: "swap", args: [x1, y1, x2, y2].map(String) };
  }
  if (roll < 0.8) {
    const [x, y] = cell();
    const options = colors.filter((c) => c !== board[y][x].color);
    return options.length ? { name: "paint", args: [String(x), String(y), rng.pick(options)] } : null;
  }
  const arrows = board.flatMap((row, y) => row.flatMap((b, x) => (b.rot === undefined ? [] : [[x, y] as const])));
  if (!arrows.length) return null;
  const [x, y] = rng.pick(arrows);
  return { name: "rotate", args: [String(x), String(y)] };
}

/** One attempt: returns null when the scramble undid itself or no short proof could be found. */
export function generateBoards(seed: string, o: GenOptions): Generated | null {
  const rng = makeRng(seed);
  const initial = randomBoard(rng, o);
  const colors = [...new Set(initial.flat().map((b) => b.color))];
  // painting may also introduce a color the board does not use yet
  const paintColors = [...new Set([...colors, rng.pick(COLORS)])];

  const k = o.ops[0] + rng.int(o.ops[1] - o.ops[0] + 1);
  let board = initial;
  const scramble: Move[] = [];
  for (let tries = 0; scramble.length < k && tries < k * 20; tries++) {
    const m = randomMove(rng, board, paintColors);
    if (!m) continue;
    try {
      board = applyOp(board, toOp(m));
    } catch (e) {
      if (e instanceof PuzzleError) continue;
      throw e;
    }
    scramble.push(m);
  }
  if (scramble.length < k) return null;

  const probe: Level = {
    id: 0,
    title: "",
    description: "",
    gridSize: o.size,
    initialState: initial,
    targetState: board,
    parLimit: 99,
    optimalLines: 0,
  };
  const solution = solveSequence(probe, initial);
  if (!solution || solution.length < 2) return null; // unsolved within the search cap, or too trivial to be a puzzle
  return { initial, target: board, scramble, solution, optimalLines: solution.length, parLimit: solution.length + 2 };
}

/** The proof as source text, one command per line. */
export const moveToSource = (m: Move) => `${m.name}(${m.args.join(", ")})`;

// ---- puzzles for the Daily Theorem and battles -----------------------------------------------------------
export interface Puzzle {
  level: Level;
  /** the level as a base64url custom-level payload, which is how the browser receives it */
  payload: string;
  generated: Generated;
}

/** A 3x3 puzzle made by 3-7 random transformations. The same seed always gives the same puzzle. */
export function generatePuzzle(seed: string, title: string): Puzzle {
  const options: GenOptions = { size: 3, ops: [3, 7], colors: 3, arrows: [1, 2] };
  for (let attempt = 0; attempt < 200; attempt++) {
    const g = generateBoards(`${seed}#${attempt}`, options);
    if (!g) continue;
    const payload: CustomPayload = {
      title,
      size: 3,
      initial: boardToRows(g.initial),
      target: boardToRows(g.target),
      par: g.parLimit,
      optimal: g.optimalLines,
    };
    const level = customToLevel(payload);
    return { level, payload: level.custom!, generated: g };
  }
  throw new Error("could not generate a puzzle");
}
