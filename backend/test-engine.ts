// Differential test of the game engine: thousands of random one- and two-command proofs, on three board setups
// (including illegal moves, rotating blocks that have no arrow, and locked blocks), run through the real engine
// (parseProgram + runMock) and through a second implementation written here from the rules alone, using a different
// board representation. Both must agree on every board after every step and on where and why a proof stops.
//   npm run test:engine
import assert from "node:assert/strict";
import { COLORS, Level, parseGrid } from "../frontend/src/data/levels";
import { parseProgram, runMock } from "./engine";
import { makeRng } from "./puzzleGenerator";

// ---- the reference model: cells are strings "color" or "color:rot" ---------------------------------------
type Cell = string;
type Grid = Cell[][];
type Command = { name: "swap" | "paint" | "rotate"; args: (number | string)[] };

const toGrid = (rows: string[]): Grid =>
  rows.map((r) =>
    r.split(" ").map((tok) => {
      const color = { B: "blue", G: "green", R: "red", Y: "yellow", P: "purple" }[tok[0]]!;
      const rot = tok.length > 1 ? "^>v<".indexOf(tok[1]) : -1;
      return rot < 0 ? color : `${color}:${rot}`;
    }),
  );

type Outcome = { grids: Grid[]; stop?: { why: "outside" | "locked" | "no-arrow"; cells: string[] } };

function reference(start: Grid, locked: string[], cmds: Command[]): Outcome {
  let g = start.map((r) => [...r]);
  const grids: Grid[] = [];
  const n = g.length;
  const inside = ([x, y]: number[]) => x >= 0 && x < n && y >= 0 && y < n;
  for (const c of cmds) {
    const pts: number[][] = c.name === "swap" ? [[c.args[0] as number, c.args[1] as number], [c.args[2] as number, c.args[3] as number]] : [[c.args[0] as number, c.args[1] as number]];
    if (pts.some((p) => !inside(p))) return { grids, stop: { why: "outside", cells: pts.filter(inside).map((p) => p.join(",")) } };
    const stuck = pts.filter((p) => locked.includes(p.join(",")));
    if (stuck.length) return { grids, stop: { why: "locked", cells: stuck.map((p) => p.join(",")) } };
    g = g.map((r) => [...r]);
    if (c.name === "swap") {
      const [[x1, y1], [x2, y2]] = pts;
      [g[y1][x1], g[y2][x2]] = [g[y2][x2], g[y1][x1]];
    } else if (c.name === "paint") {
      const [[x, y]] = pts;
      const rot = g[y][x].split(":")[1];
      g[y][x] = rot === undefined ? (c.args[2] as string) : `${c.args[2]}:${rot}`;
    } else {
      const [[x, y]] = pts;
      const [color, rot] = g[y][x].split(":");
      if (rot === undefined) return { grids, stop: { why: "no-arrow", cells: [`${x},${y}`] } };
      g[y][x] = `${color}:${(Number(rot) + 1) % 4}`;
    }
    grids.push(g);
  }
  return { grids };
}

const gridOf = (board: { color: string; rot?: number }[][]): Grid => board.map((r) => r.map((b) => (b.rot === undefined ? b.color : `${b.color}:${b.rot}`)));
const why = (message: string) => (/outside/.test(message) ? "outside" : /locked/.test(message) ? "locked" : /no direction/.test(message) ? "no-arrow" : message);

// ---- the three setups ---------------------------------------------------------------------------------------
interface Setup { name: string; rows: string[]; locked: [number, number][]; runs: number }
const SETUPS: Setup[] = [
  { name: "3x3 with arrows", rows: ["R B G", "Y^ P> B", "G Rv Y<"], locked: [], runs: 6770 },
  { name: "4x4 with arrows", rows: ["R B G P", "Y^ P> B R", "G Rv Y< B", "P B Gv Y"], locked: [], runs: 6770 },
  { name: "3x3 with locked blocks", rows: ["R B G", "Y^ P> B", "G Rv Y<"], locked: [[0, 0], [1, 1]], runs: 6770 },
];

const rng = makeRng("engine-differential-test");
let total = 0;

for (const setup of SETUPS) {
  const size = setup.rows.length;
  const level: Level = {
    id: 0, title: "", description: "", gridSize: size as 3 | 4, initialState: parseGrid(setup.rows), parLimit: 99, optimalLines: 1,
    ...(setup.locked.length && { locked: setup.locked }),
  };
  const lockedKeys = setup.locked.map(([x, y]) => `${x},${y}`);
  const start = toGrid(setup.rows);
  // coordinates run one past the board on each side, so some commands are out of bounds
  const coord = () => rng.int(size + 2) - 1;
  let stopped = 0;
  const reasons = new Set<string>();

  for (let i = 0; i < setup.runs; i++) {
    const cmds: Command[] = Array.from({ length: 1 + rng.int(2) }, () => {
      const roll = rng.int(3);
      if (roll === 0) return { name: "swap", args: [coord(), coord(), coord(), coord()] };
      if (roll === 1) return { name: "paint", args: [coord(), coord(), rng.pick(COLORS)] };
      return { name: "rotate", args: [coord(), coord()] };
    });
    // negative numbers are not valid source, so a negative coordinate stands for "outside" with a number past the edge
    const text = cmds.map((c) => `${c.name}(${c.args.map((a) => (typeof a === "number" && a < 0 ? size + 7 : a)).join(", ")})`).join("\n");
    const fixed = cmds.map((c) => ({ ...c, args: c.args.map((a) => (typeof a === "number" && a < 0 ? size + 7 : a)) }));

    const { ops } = parseProgram(text, 99);
    const real = runMock(level, ops);
    const model = reference(start, lockedKeys, fixed);

    assert.equal(real.steps.length, model.grids.length, `${setup.name} #${i}: steps\n${text}`);
    real.steps.forEach((s, k) => assert.deepEqual(gridOf(s.board), model.grids[k], `${setup.name} #${i}: board after step ${k + 1}\n${text}`));
    assert.equal(!!real.error, !!model.stop, `${setup.name} #${i}: error or not\n${text}`);
    if (real.error && model.stop) {
      assert.equal(why(real.error.message), model.stop.why, `${setup.name} #${i}: reason\n${text}`);
      assert.deepEqual(real.error.cells.map((c) => c.join(",")).sort(), [...model.stop.cells].sort(), `${setup.name} #${i}: highlighted blocks\n${text}`);
      assert.equal(real.error.line, real.steps.length + 1, `${setup.name} #${i}: the proof stops at the first bad line\n${text}`);
      stopped++;
      reasons.add(model.stop.why);
    }
    total++;
  }
  console.log(`  ok  ${setup.name}: ${setup.runs} proofs agree (${stopped} stopped at an illegal move: ${[...reasons].sort().join(", ")})`);
}
console.log(`\n${total} comparisons, no disagreement`);
