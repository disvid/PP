// Heuristic "auto-tactic": breadth-first proof search over single-block commands, pruned to moves that
// make progress towards the target. It finds a shortest sequence in single-block moves (macros are
// ignored), and the hint is only the first move of that sequence.
import { Block, Board, blocksEqual, COLORS, isSolved, Level, violations } from "../frontend/src/data/levels";
import { applyOp, Op, PuzzleError } from "./engine";

export interface Hint {
  kind: "swap" | "paint" | "rotate";
  cells: [number, number][];
  color?: string;
  /** Moves left in the shortest single-block solution found (null if only a greedy guess). */
  remaining: number | null;
}

export type Move = Omit<Op, "line">;

const key = (b: Board) => b.map((r) => r.map((c) => c.color[0] + (c.rot ?? "-")).join("")).join("/");
const apply = (b: Board, m: Move): Board | null => {
  try {
    return applyOp(b, { ...m, line: 0 });
  } catch (e) {
    if (e instanceof PuzzleError) return null;
    throw e;
  }
};
const cellsOf = (b: Board) => b.flatMap((row, y) => row.map((_, x) => [x, y] as const));
const cost = (c: Block, t: Block) => (c.color !== t.color ? 1 : 0) + (c.rot !== t.rot ? 1 : 0);

function allMoves(b: Board): Move[] {
  const cs = cellsOf(b);
  const moves: Move[] = [];
  for (const [x, y] of cs) {
    for (const c of COLORS) if (b[y][x].color !== c) moves.push({ name: "paint", args: [String(x), String(y), c] });
    if (b[y][x].rot !== undefined) moves.push({ name: "rotate", args: [String(x), String(y)] });
  }
  for (let i = 0; i < cs.length; i++)
    for (let j = i + 1; j < cs.length; j++) {
      const [x1, y1] = cs[i];
      const [x2, y2] = cs[j];
      if (!blocksEqual(b[y1][x1], b[y2][x2])) moves.push({ name: "swap", args: [x1, y1, x2, y2].map(String) });
    }
  return moves;
}

/** Only moves that bring some cell closer to the target board. */
function usefulMoves(b: Board, t: Board): Move[] {
  const cs = cellsOf(b);
  const moves: Move[] = [];
  for (const [x, y] of cs) {
    if (b[y][x].color !== t[y][x].color) moves.push({ name: "paint", args: [String(x), String(y), t[y][x].color] });
    if (b[y][x].rot !== undefined && t[y][x].rot !== undefined && b[y][x].rot !== t[y][x].rot)
      moves.push({ name: "rotate", args: [String(x), String(y)] });
  }
  for (let i = 0; i < cs.length; i++)
    for (let j = i + 1; j < cs.length; j++) {
      const [x1, y1] = cs[i];
      const [x2, y2] = cs[j];
      const now = cost(b[y1][x1], t[y1][x1]) + cost(b[y2][x2], t[y2][x2]);
      const then = cost(b[y2][x2], t[y1][x1]) + cost(b[y1][x1], t[y2][x2]);
      if (then < now) moves.push({ name: "swap", args: [x1, y1, x2, y2].map(String) });
    }
  return moves;
}

interface Node {
  b: Board;
  move?: Move;
  parent?: Node;
}

/** Breadth-first search; returns the whole shortest move sequence, or null if none was found within `cap` states. */
function bfs(start: Board, goal: (b: Board) => boolean, moves: (b: Board) => Move[], cap: number): Move[] | null {
  const seen = new Set([key(start)]);
  let frontier: Node[] = [{ b: start }];
  let nodes = 0;
  while (frontier.length) {
    const next: Node[] = [];
    for (const node of frontier)
      for (const m of moves(node.b)) {
        const nb = apply(node.b, m);
        if (!nb) continue;
        const k = key(nb);
        if (seen.has(k)) continue;
        seen.add(k);
        const child: Node = { b: nb, move: m, parent: node };
        if (goal(nb)) {
          const path: Move[] = [];
          for (let n: Node | undefined = child; n?.move; n = n.parent) path.unshift(n.move);
          return path;
        }
        if (++nodes > cap) return null;
        next.push(child);
      }
    frontier = next;
  }
  return null;
}

const toHint = (m: Move, remaining: number | null): Hint => {
  const n = m.args.map(Number);
  if (m.name === "swap") return { kind: "swap", cells: [[n[0], n[1]], [n[2], n[3]]], remaining };
  if (m.name === "paint") return { kind: "paint", cells: [[n[0], n[1]]], color: m.args[2], remaining };
  return { kind: "rotate", cells: [[n[0], n[1]]], remaining };
};

/** Next move for the board the player currently has, or null if it is already solved / nothing found. */
export function findHint(level: Level, board: Board): Hint | null {
  const goal = (b: Board) => isSolved(level, b);
  if (goal(board)) return null;
  const t = level.targetState;
  const pruned = t ? bfs(board, goal, (b) => usefulMoves(b, t), 300_000) : null;
  const found = pruned ?? bfs(board, goal, allMoves, 250_000);
  if (found) return toHint(found[0], found.length);
  // No short proof found: fall back to the single move that most reduces the distance.
  const score = (b: Board) => (level.property ? violations(b, level.property) : 0) + (t ? b.flat().reduce((s, c, i) => s + cost(c, t.flat()[i]), 0) : 0);
  let best: { m: Move; s: number } | null = null;
  for (const m of allMoves(board)) {
    const nb = apply(board, m);
    if (nb && (!best || score(nb) < best.s)) best = { m, s: score(nb) };
  }
  return best && best.s < score(board) ? toHint(best.m, null) : null;
}

/**
 * A shortest sequence of single-block commands that solves the level from `board` (breadth-first search over moves
 * that make progress, then over all moves), or null if the search gave up.
 */
export function solveSequence(level: Level, board: Board): Move[] | null {
  const goal = (b: Board) => isSolved(level, b);
  if (goal(board)) return [];
  const t = level.targetState;
  return (t ? bfs(board, goal, (b) => usefulMoves(b, t), 300_000) : null) ?? bfs(board, goal, allMoves, 250_000);
}

/** Fewest single-block commands that solve the level from `board`, or null if the search gave up. */
export function shortestSolution(level: Level, board: Board): number | null {
  return solveSequence(level, board)?.length ?? null;
}
