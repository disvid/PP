// Runs every level's reference proof through real Lean and checks that Lean agrees with the TypeScript engine: the same
// board after every step, the same verdict, and a kernel-checked certificate (`verified`) for every solve. Also checks
// the cases that must NOT verify (an unsolved board, an illegal move, a locked block, a proof that would need `sorry`).
//   npm run verify:lean            needs Lean (elan); builds the Puzzle library on first use
import assert from "node:assert/strict";
import { customToLevel, Level, LEVELS } from "../frontend/src/data/levels";
import { parseProgram, runMock } from "./engine";
import { evaluateProof, leanAvailable, leanVersion } from "./proof";
import { SOLUTIONS } from "./solutions";

const sameBoards = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

async function waitForLean(ms = 600_000) {
  const start = Date.now();
  while (!leanAvailable && Date.now() - start < ms) await new Promise((r) => setTimeout(r, 500));
  return leanAvailable;
}

async function main() {
  if (!(await waitForLean(60_000)) && !(await waitForLean(600_000))) {
    console.error("Lean is not available. Install it with elan (https://lean-lang.org/install) and run again.");
    process.exit(2);
  }
  console.log(`Judge: ${leanVersion}\n`);

  let failures = 0;
  const started = Date.now();
  const queue = [...LEVELS];
  const worker = async () => {
    for (let lv = queue.shift(); lv; lv = queue.shift()) {
      const code = SOLUTIONS[lv.id];
      const t0 = Date.now();
      const lean = await evaluateProof(lv, code);
      const { ops } = parseProgram(code, lv.parLimit);
      const mock = runMock(lv, ops);
      const problems: string[] = [];
      if (lean.engine !== "lean") problems.push("not judged by Lean");
      if (!lean.solved) problems.push(`not solved: ${lean.message}`);
      if (!lean.verified) problems.push("no kernel certificate");
      if (!sameBoards(lean.steps.map((s) => s.board), mock.steps.map((s) => s.board))) problems.push("boards differ from the TypeScript engine");
      if (lean.linesUsed !== lv.optimalLines) problems.push(`used ${lean.linesUsed} lines, expected ${lv.optimalLines}`);
      if (problems.length) failures++;
      console.log(`${String(lv.id).padStart(2)}  ${problems.length ? "FAIL " + problems.join("; ") : "verified"}  (${Date.now() - t0} ms)`);
    }
  };
  await Promise.all([worker(), worker()]);
  console.log(`\n${LEVELS.length} reference proofs through Lean in ${((Date.now() - started) / 1000).toFixed(1)} s, ${failures} failure(s)`);

  console.log("\nthings that must not verify");
  const level1: Level = LEVELS[0];
  const expectNo = async (name: string, level: Level, code: string, check: (r: Awaited<ReturnType<typeof evaluateProof>>) => void) => {
    const r = await evaluateProof(level, code);
    try {
      check(r);
      console.log(`  ok  ${name}`);
    } catch (e) {
      failures++;
      console.log(`  FAIL ${name}: ${(e as Error).message}`);
    }
  };
  await expectNo("a legal proof that does not solve the level", level1, "paint(0, 0, red)", (r) => {
    assert.equal(r.engine, "lean");
    assert.equal(r.solved, false);
    assert.equal(r.verified, false);
    assert.equal(r.error, null);
  });
  await expectNo("an illegal move: Lean reports the line and the block", level1, "paint(1, 1, green)\npaint(7, 7, red)", (r) => {
    assert.equal(r.error?.line, 2);
    assert.match(r.error!.message, /outside the 3x3 board/);
    assert.deepEqual(r.error!.cells, []);
    assert.equal(r.steps.length, 1);
  });
  const locked = customToLevel({ title: "locked", size: 3, initial: ["B B B", "B B B", "B B B"], target: ["B B B", "B G B", "B B B"], par: 3, optimal: 1, locked: [[0, 0]] });
  await expectNo("a locked block: Lean refuses the move and names the block", locked, "paint(0, 0, red)", (r) => {
    assert.match(r.error!.message, /block \(0, 0\) is locked/);
    assert.deepEqual(r.error!.cells, [[0, 0]]);
  });
  await expectNo("the same locked level is solvable and certified around the lock", locked, "paint(1, 1, green)", (r) => {
    assert.equal(r.solved, true);
    assert.equal(r.verified, true);
  });
  const arrow = LEVELS.find((l) => l.initialState.flat().some((b) => b.rot !== undefined))!;
  await expectNo("rotating a block that has no arrow", { ...arrow, initialState: level1.initialState }, "rotate(0, 0)", (r) => {
    assert.match(r.error!.message, /has no direction to rotate/);
  });
  await expectNo("a proof that says `sorry` never reaches Lean", level1, "sorry", (r) => {
    assert.ok(r.error);
    assert.equal(r.verified, false);
  });

  console.log(failures ? `\n${failures} failure(s)` : "\nLean agrees with the game on every level.");
  process.exit(failures ? 1 : 0);
}

void main();
