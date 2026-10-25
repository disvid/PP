// Sanity check for levels.ts. For every level it proves:
//  - upper bound: a reference solution of exactly `optimalLines` lines solves the level (it is run here);
//  - lower bound: no program can be shorter than min(C, 1 + ceil(C / 4)), where C is the fewest single-block
//    commands any solution needs (BFS) and a helper holds at most 4 commands, so a call line does at most 4
//    and a helper costs a line of its own.
// When the two meet, `optimalLines` is provably the shortest valid proof. Run with: npm run verify
import { BUILTIN_LEVEL_COUNT } from "../frontend/src/data/achievements";
import { COLORS, isSolved, LEVELS } from "../frontend/src/data/levels";
import { applyOp, parseProgram, PuzzleError, runMock } from "./engine";
import { findHint, shortestSolution } from "./hint";
import { SOLUTIONS } from "./solutions";

let failures = 0;
const fail = (id: number, msg: string) => {
  failures++;
  console.log(`  FAIL level ${id}: ${msg}`);
};

if (LEVELS.length !== BUILTIN_LEVEL_COUNT) {
  failures++;
  console.log(`  FAIL: expected exactly ${BUILTIN_LEVEL_COUNT} levels, found ${LEVELS.length}`);
}
const seenTitles = new Set<string>();
for (const lv of LEVELS) {
  if (seenTitles.has(lv.title)) fail(lv.id, `duplicate title "${lv.title}"`);
  seenTitles.add(lv.title);
  if (lv.id >= 24 && /^(Shuffle|Scramble|Chaos)\b/.test(lv.title)) fail(lv.id, `generic title "${lv.title}"`);
}
console.log("id  par  optimal  lower-bound  cmds  hint solver");
LEVELS.forEach((lv, i) => {
  if (lv.id !== i + 1) fail(lv.id, "ids must be 1..N in order");
  for (const board of [lv.initialState, lv.targetState ?? lv.initialState]) {
    if (board.length !== lv.gridSize || board.some((r) => r.length !== lv.gridSize)) fail(lv.id, "grid size mismatch");
    if (board.flat().some((b) => !COLORS.includes(b.color))) fail(lv.id, "bad color");
  }
  if (lv.optimalLines > lv.parLimit) fail(lv.id, "optimalLines exceeds the par limit");

  const solution = SOLUTIONS[lv.id];
  if (!solution) return fail(lv.id, "no reference solution");
  let lines = 0;
  try {
    const parsed = parseProgram(solution, lv.parLimit);
    lines = parsed.statementLines;
    const { steps, error } = runMock(lv, parsed.ops);
    if (error) fail(lv.id, `solution errored: ${error.message}`);
    else if (!isSolved(lv, steps[steps.length - 1]?.board ?? lv.initialState)) fail(lv.id, "solution does not reach the target");
    if (lines !== lv.optimalLines) fail(lv.id, `reference solution has ${lines} lines but optimalLines is ${lv.optimalLines}`);
    // one line over par must be rejected with the par error
    try {
      parseProgram(solution + "\n" + "paint(0, 0, blue)\n".repeat(Math.max(0, lv.parLimit - lines + 1)), lv.parLimit);
      fail(lv.id, "over-par script was accepted");
    } catch (e) {
      if (!(e instanceof PuzzleError) || e.message !== "Proof too long. Use a helper macro.") fail(lv.id, `wrong par error: ${e}`);
    }
  } catch (e) {
    fail(lv.id, `solution rejected: ${e instanceof Error ? e.message : e}`);
  }

  // lower bound
  const cmds = shortestSolution(lv, lv.initialState);
  let bound = 0;
  if (cmds === null) fail(lv.id, "BFS gave up, no lower bound");
  else {
    bound = Math.min(cmds, 1 + Math.ceil(cmds / 4));
    if (bound > lv.optimalLines) fail(lv.id, `a reference solution beats the lower bound (${lv.optimalLines} < ${bound}): bound or solution is wrong`);
  }

  // the hint solver must be able to walk the level to the end
  let hintOk = "ok";
  const t0 = Date.now();
  let b = lv.initialState;
  for (let n = 0; n < 40 && !isSolved(lv, b); n++) {
    const h = findHint(lv, b);
    if (!h) { hintOk = "NO HINT"; failures++; break; }
    const args = h.kind === "swap" ? h.cells.flat().map(String) : h.kind === "paint" ? [...h.cells[0].map(String), h.color!] : h.cells[0].map(String);
    b = applyOp(b, { name: h.kind, line: 0, args });
    if (n === 39) { hintOk = "LOOP"; failures++; }
  }
  console.log(
    `${String(lv.id).padStart(2)}  ${String(lv.parLimit).padStart(3)}  ${String(lv.optimalLines).padStart(7)}  ${String(bound).padStart(11)}${bound === lv.optimalLines ? " ✓" : " ?"} ${String(cmds).padStart(5)}  ${hintOk} ${Date.now() - t0}ms`,
  );
});

console.log(failures ? `\n${failures} problem(s)` : "\nAll levels verified (✓ = optimal proven by matching lower bound)");
process.exit(failures ? 1 : 0);
