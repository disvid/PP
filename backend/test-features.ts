// End-to-end check of streaks, achievements and the tutorial. It starts the real server in this process on a throwaway
// database and talks to it over HTTP, so it exercises exactly what the browser does.   Run with: npm run test:features
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PORT = 3991;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "swappr-features-"));
process.env.DB_PATH = path.join(dir, "test.db");
process.env.PORT = String(PORT);
process.env.NODE_ENV = "test";
const BASE = `http://localhost:${PORT}`;

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
};

interface Reply { status: number; data: any }
async function call(pathname: string, body?: unknown, token?: string): Promise<Reply> {
  const res = await fetch(BASE + pathname, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}
const register = async (name: string) => (await call("/api/register", { username: name, password: "correct-horse-9" })).data.token as string;

async function main() {
  const { streakStats, addDays } = await import("./streak");
  const { LESSONS } = await import("../frontend/src/data/tutorial");
  const { ACHIEVEMENTS } = await import("../frontend/src/data/achievements");
  const { SOLUTIONS } = await import("./solutions");
  const { LEVELS, customToLevel, decodeCustom } = await import("../frontend/src/data/levels");
  const { db, userByName } = await import("./db");
  const { todaysDaily } = await import("./daily");
  const { onBattleWin } = await import("./achievements");
  await import("./index"); // starts listening

  console.log("streak maths");
  const T = "2026-03-10";
  check("no days -> 0", () => assert.deepEqual(streakStats([], T), { current: 0, longest: 0, todayDone: false }));
  check("today only -> 1", () => assert.deepEqual(streakStats([T], T), { current: 1, longest: 1, todayDone: true }));
  check("alive until midnight: yesterday counts while today is open", () =>
    assert.deepEqual(streakStats(["2026-03-09", "2026-03-08", "2026-03-07"], T), { current: 3, longest: 3, todayDone: false }));
  check("a missed day breaks it", () => assert.equal(streakStats(["2026-03-08", "2026-03-07"], T).current, 0));
  check("longest survives a break", () =>
    assert.deepEqual(streakStats([T, "2026-03-09", "2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04"], T), { current: 2, longest: 4, todayDone: true }));
  check("month and year boundaries", () => {
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
    assert.equal(addDays("2026-01-01", -1), "2025-12-31");
    assert.equal(streakStats(["2025-12-31", "2026-01-01"], "2026-01-01").current, 2);
  });
  check("duplicates and order are ignored", () => assert.equal(streakStats([T, T, "2026-03-09"], T).current, 2));

  console.log("tutorial");
  const lessonCode = (id: string) => LESSONS.find((l) => l.id === id)!.solution;
  for (const l of LESSONS) {
    const r = await call("/api/tutorial/check", { lesson: l.id, code: l.solution });
    check(`lesson "${l.id}": the reference proof passes`, () => assert.equal(r.data.passed, true, JSON.stringify(r.data)));
  }
  let r = await call("/api/tutorial/check", { lesson: "paint", code: "paint(0, 0, green)" });
  check("a run that does not solve the lesson says why", () => {
    assert.equal(r.data.passed, false);
    assert.match(r.data.message, /middle block/);
  });
  r = await call("/api/tutorial/check", { lesson: "helper", code: "paint(0, 0, red)\npaint(2, 0, red)\npaint(0, 2, red)\npaint(2, 2, red)" });
  check("the helper lesson cannot be passed without a helper (par is 3)", () => {
    assert.equal(r.data.passed, false);
    assert.ok(r.data.error);
  });
  r = await call("/api/tutorial/check", { lesson: "nope", code: "x" });
  check("unknown lesson -> 404", () => assert.equal(r.status, 404));
  check("lesson code is used, not trusted: swap in a rotate lesson fails", () => assert.ok(lessonCode("rotate")));
  r = await call("/api/tutorial/check", { lesson: "rotate", code: "swap(0, 0, 1, 0)" });
  check("a wrong command on the rotate lesson does not pass", () => assert.equal(r.data.passed, false));

  console.log("achievements via the API");
  const tokenA = await register("alice");
  const alice = userByName("alice")!;
  r = await call("/api/tutorial/complete", {}, tokenA);
  check("finishing the tutorial unlocks Graduate", () => assert.deepEqual(r.data.achievements, ["tutorial"]));
  r = await call("/api/tutorial/complete", {}, tokenA);
  check("...only once", () => assert.deepEqual(r.data.achievements, []));
  check("tutorial/complete needs a sign-in", () => assert.ok(true));
  assert.equal((await call("/api/tutorial/complete", {})).status, 401);
  assert.equal((await call("/api/achievements")).status, 401);
  assert.equal((await call("/api/daily/stats")).status, 401);

  // a built-in level that is solved with a helper, one without
  const withHelper = LEVELS.find((l) => /^[ \t]*def[ \t]/m.test(SOLUTIONS[l.id]) && l.id <= 23)!;
  const plain = LEVELS.find((l) => !/def/.test(SOLUTIONS[l.id]) && l.id <= 23)!;
  const solveBuiltin = async (token: string, id: number, code: string) => {
    const s = await call("/api/sessions/start", { levelId: id }, token);
    assert.equal(s.status, 200);
    return (await call("/api/evaluate", { levelId: id, code }, token)).data;
  };
  let e = await solveBuiltin(tokenA, plain.id, SOLUTIONS[plain.id]);
  check(`level ${plain.id} (optimal, no helper): First solve + optimal`, () => {
    assert.equal(e.solved, true);
    assert.deepEqual([...e.achievements].sort(), ["first_solve", "matched_optimal"]);
    assert.equal(e.streak, null);
  });
  e = await solveBuiltin(tokenA, withHelper.id, SOLUTIONS[withHelper.id]);
  check(`level ${withHelper.id} (helper): Macro Maker`, () => assert.ok(e.achievements.includes("helper"), JSON.stringify(e.achievements)));
  e = await solveBuiltin(tokenA, plain.id, SOLUTIONS[plain.id]);
  check("solving the same level again unlocks nothing new", () => assert.deepEqual(e.achievements, []));

  // not started -> no score, no badge
  const tokenB = await register("bob");
  e = (await call("/api/evaluate", { levelId: plain.id, code: SOLUTIONS[plain.id] }, tokenB)).data;
  check("a solve without starting the level earns nothing", () => assert.deepEqual(e.achievements, []));

  // beating the optimum: pick a generated level and give it a deliberately shorter-than-optimal claim via the engine
  // is impossible (optima are proven), so check the rule directly
  const { onSolve } = await import("./achievements");
  const carol = (await register("carol"), userByName("carol")!);
  const beat = onSolve({ userId: carol.id, code: "paint(0, 0, red)", lines: 2, optimalLines: 3, builtin: true, daily: false });
  check("fewer lines than the optimum -> Beat the Machine (+ matched)", () => {
    assert.ok(beat.includes("beat_optimal"));
    assert.ok(beat.includes("matched_optimal"));
  });

  // custom levels cannot farm badges
  const custom = (
    await call("/api/custom-levels", { title: "mine", size: 3, initial: ["B B B", "B B B", "B B B"], target: ["B B B", "B G B", "B B B"], par: 2, optimal: 1 })
  ).data;
  const tokenD = await register("dave");
  await call("/api/sessions/start", { custom: custom.level }, tokenD);
  e = (await call("/api/evaluate", { custom: custom.level, code: "paint(1, 1, green)" }, tokenD)).data;
  check("a custom level solve earns no badges", () => {
    assert.equal(e.solved, true);
    assert.deepEqual(e.achievements, []);
  });

  console.log("daily streak and badges");
  const daily = todaysDaily();
  const dailyLevel = customToLevel(decodeCustom(daily.payload));
  const today = daily.date;
  const info = (await call("/api/daily", undefined, tokenA)).data;
  check("daily info carries the streak and no completion yet", () => {
    assert.equal(info.completion, null);
    assert.deepEqual(info.streak, { current: 0, longest: 0, todayDone: false });
  });

  // seed six earlier days for erin (a "streak of 6") and a gap for frank
  const tokenE = await register("erin");
  const tokenF = await register("frank");
  const erin = userByName("erin")!;
  const frank = userByName("frank")!;
  const putPuzzle = db.prepare("INSERT OR IGNORE INTO daily_puzzles (date, number, level_key, payload, optimal_lines, solution) VALUES (?, ?, ?, 'x', 3, 'x')");
  const putDone = db.prepare("INSERT OR IGNORE INTO daily_completions (user_id, date, lines, optimal_lines, completed_at) VALUES (?, ?, ?, 3, 0)");
  for (const back of [1, 2, 3, 4, 5, 6]) {
    const date = addDays(today, -back);
    putPuzzle.run(date, 1000 - back, `fake_${back}`);
    putDone.run(erin.id, date, 3);
    if (back !== 3) putDone.run(frank.id, date, 5); // frank skips day -3
  }
  let st = (await call("/api/daily/stats", undefined, tokenE)).data;
  check("erin: 6 days up to yesterday, today still open -> current 6", () => {
    assert.equal(st.current, 6);
    assert.equal(st.todayDone, false);
    assert.equal(st.solved, 6);
  });
  st = (await call("/api/daily/stats", undefined, tokenF)).data;
  check("frank: the gap leaves a streak of 2 (longest 3)", () => {
    assert.equal(st.current, 2);
    assert.equal(st.longest, 3);
  });

  const playDaily = async (token: string, code: string) => {
    const s = await call("/api/sessions/start", { custom: daily.payload }, token);
    if (s.status === 409) return { locked: true }; // the clock will not even start once the day is used up
    assert.equal(s.status, 200);
    return (await call("/api/evaluate", { custom: daily.payload, code }, token)).data;
  };
  e = await playDaily(tokenE, daily.solution);
  check("erin completes today's daily: streak 7, Week Warrior + Hat Trick + Daily Driver + Daily Perfection", () => {
    assert.equal(e.solved, true, JSON.stringify(e));
    assert.equal(e.streak.current, 7);
    for (const k of ["daily_first", "daily_optimal", "streak_3", "streak_7", "matched_optimal"]) assert.ok(e.achievements.includes(k), `${k} missing: ${e.achievements}`);
    assert.ok(!e.achievements.includes("streak_30"));
  });
  e = await playDaily(tokenE, daily.solution);
  check("a second attempt the same day is refused (one shot)", () => assert.equal(e.locked, true));
  st = (await call("/api/daily/stats", undefined, tokenE)).data;
  check("stats now show 7 solved, today done, history includes today", () => {
    assert.equal(st.current, 7);
    assert.equal(st.todayDone, true);
    assert.equal(st.history.at(-1).date, today);
    assert.equal(st.optimal, 7);
  });
  const done = (await call("/api/daily", undefined, tokenE)).data;
  check("daily info exposes the stored time and streak", () => {
    assert.equal(done.streak.current, 7);
    assert.ok("timeMs" in done.completion);
  });

  e = await playDaily(tokenF, daily.solution);
  check("frank (current 2) reaches 3 -> Hat Trick only", () => {
    assert.equal(e.streak.current, 3);
    assert.ok(e.achievements.includes("streak_3"));
    assert.ok(!e.achievements.includes("streak_7"));
  });

  console.log("battle badges and the report");
  check("a battle win earns Duelist; the first-compile win also earns Flawless Duel", () => {
    assert.deepEqual(onBattleWin(erin.id, 3), ["battle_win"]);
    assert.deepEqual(onBattleWin(frank.id, 1), ["battle_win", "battle_clean"]);
    assert.deepEqual(onBattleWin(frank.id, 1), []);
    assert.deepEqual(onBattleWin(erin.id, 1), ["battle_clean"]);
  });
  const rep = (await call("/api/achievements", undefined, tokenA)).data;
  check("/api/achievements reports unlocked badges with progress", () => {
    assert.ok(rep.unlocked.tutorial && rep.unlocked.first_solve && rep.unlocked.helper);
    assert.equal(rep.progress.solved, 2);
    assert.ok(ACHIEVEMENTS.every((a) => typeof a.title === "string" && a.title && a.description && a.icon));
    assert.equal(new Set(ACHIEVEMENTS.map((a) => a.key)).size, ACHIEVEMENTS.length);
  });
  check("alice has no daily streak", () => assert.equal(rep.streak.current, 0));

  console.log("locked blocks");
  const lockedLevel = { title: "locked", size: 3, initial: ["B B B", "B B B", "B B B"], target: ["B B B", "B G B", "B B B"], par: 3, optimal: 1, locked: [[0, 0], [2, 2]] };
  const made = await call("/api/custom-levels", lockedLevel);
  check("a level with locked blocks can be created", () => assert.equal(made.status, 200, JSON.stringify(made.data)));
  const lockedPayload = made.data.level as string;
  let lr = (await call("/api/evaluate", { custom: lockedPayload, code: "paint(0, 0, red)" })).data;
  check("touching a locked block is an illegal move that names the block", () => {
    assert.match(lr.error.message, /locked/);
    assert.deepEqual(lr.error.cells, [[0, 0]]);
    assert.equal(lr.error.line, 1);
  });
  lr = (await call("/api/evaluate", { custom: lockedPayload, code: "swap(1, 1, 2, 2)" })).data;
  check("a swap with a locked block is refused too", () => assert.match(lr.error.message, /\(2, 2\) is locked/));
  lr = (await call("/api/evaluate", { custom: lockedPayload, code: "paint(1, 1, green)" })).data;
  check("the rest of the board still works", () => assert.equal(lr.solved, true));
  check("a locked block must be identical in both boards", () => assert.ok(true));
  assert.equal((await call("/api/custom-levels", { ...lockedLevel, locked: [[1, 1]] })).status, 400);
  assert.equal((await call("/api/custom-levels", { ...lockedLevel, locked: [[0, 0], [0, 0]] })).status, 400);
  assert.equal((await call("/api/custom-levels", { ...lockedLevel, locked: [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]] })).status, 400);
  assert.equal((await call("/api/custom-levels", { ...lockedLevel, locked: [[3, 0]] })).status, 400);
  const { generatePuzzle } = await import("./puzzleGenerator");
  const { runMock, parseProgram } = await import("./engine");
  const { isSolved } = await import("../frontend/src/data/levels");
  let withLocks = 0;
  for (let i = 0; i < 40; i++) {
    const p = generatePuzzle(`lock-test-${i}`, "t");
    const again = generatePuzzle(`lock-test-${i}`, "t");
    assert.equal(p.payload, again.payload, "generation is deterministic");
    const locks = p.level.locked ?? [];
    withLocks += locks.length > 0 ? 1 : 0;
    for (const [x, y] of locks) assert.deepEqual(p.level.initialState[y][x], p.level.targetState![y][x]);
    // its stored shortest proof must be legal under the locks and solve the puzzle
    const code = p.generated.solution.map((m) => `${m.name}(${m.args.join(", ")})`).join("\n");
    const { ops } = parseProgram(code, 99);
    const run = runMock(p.level, ops);
    assert.ok(!run.error && isSolved(p.level, run.steps[run.steps.length - 1].board), `puzzle ${i}`);
  }
  check(`40 generated puzzles are deterministic and their proofs respect the locks (${withLocks} had locks)`, () => assert.ok(withLocks > 0));

  console.log("hostile input and the checker's limits");
  const hostile = [
    "#eval IO.println \"hi\"",
    "sorry",
    "import Lean",
    "macro_rules | `(x) => `(y)",
    "run_tac foo",
    "axiom bad : False",
    "paint(1, 1, green)\n#eval IO.println 1",
    "def x := swap(0, 0, 1, 1)\nx(0, 0, 1, 1)",
    "paint(1, 1, green); sorry",
    "swap(0, 0, 1, 1) -- fine\n`(tactic| sorry)",
    "paint(1, 1, \"green\"); #exit",
    "open IO in paint(1, 1, green)",
  ];
  for (const code of hostile) {
    const h = (await call("/api/evaluate", { levelId: 1, code })).data;
    check(`refused before it can reach Lean: ${JSON.stringify(code).slice(0, 48)}`, () => {
      assert.equal(h.solved, false);
      assert.deepEqual(h.steps, []);
      assert.ok(h.error?.message);
    });
  }
  check("a proof longer than 5000 characters is refused", () => assert.ok(true));
  assert.equal((await call("/api/evaluate", { levelId: 1, code: "paint(1, 1, green)\n".repeat(400) })).status, 400);
  const huge = await fetch(`${BASE}/api/evaluate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ levelId: 1, code: "x".repeat(200_000) }) });
  check("a request body over 100 KB is refused (413)", () => assert.equal(huge.status, 413));

  const { createLimiter, BusyError } = await import("./limiter");
  const lim = createLimiter(2, 1);
  const gates: (() => void)[] = [];
  const hold = () => new Promise<void>((resolve) => gates.push(resolve));
  const started: number[] = [];
  const task = (n: number) => lim.run(async () => (started.push(n), await hold(), n));
  const p1 = task(1), p2 = task(2), p3 = task(3);
  await new Promise((r) => setTimeout(r, 10));
  check("limiter: 2 run at once, the third waits in the queue", () => {
    assert.deepEqual(started, [1, 2]);
    assert.deepEqual(lim.stats(), { running: 2, queued: 1 });
  });
  const refused = await task(4).then(() => null, (e) => e);
  check("limiter: with the queue full the next one is turned away at once", () => assert.ok(refused instanceof BusyError));
  gates[0]();
  await new Promise((r) => setTimeout(r, 10));
  check("limiter: a finished task hands its slot to the next in line", () => {
    assert.deepEqual(started, [1, 2, 3]);
    assert.deepEqual(lim.stats(), { running: 2, queued: 0 });
  });
  gates[1]();
  gates[2]();
  assert.deepEqual(await Promise.all([p1, p2, p3]), [1, 2, 3]);
  check("limiter: everything drains back to idle", () => assert.deepEqual(lim.stats(), { running: 0, queued: 0 }));

  const { leanInvocation } = await import("./proof");
  const box = leanInvocation("/tmp/x/Proof.lean", true, "/lean");
  const flag = (name: string) => box.args[box.args.indexOf(name) + 1];
  check("sandbox command: no network, memory/CPU/process caps, read-only, no capabilities, one read-only mount", () => {
    assert.equal(box.cmd, "docker");
    assert.equal(flag("--network"), "none");
    assert.equal(flag("--memory"), "1g");
    assert.equal(flag("--cpus"), "1");
    assert.equal(flag("--pids-limit"), "64");
    assert.ok(box.args.includes("--read-only"));
    assert.equal(flag("--cap-drop"), "ALL");
    assert.equal(box.args.filter((a) => a === "-v").length, 1);
    assert.match(box.args[box.args.indexOf("-v") + 1], /:\/proof:ro$/);
    assert.deepEqual(box.args.slice(box.args.indexOf("timeout")), ["timeout", "-s", "KILL", "15", "lake", "env", "lean", "--run", "/proof/Proof.lean"]);
  });
  const direct = leanInvocation("/tmp/x/Proof.lean", false, "/lean");
  check("without the sandbox it is a plain `lake env lean --run`", () => {
    assert.equal(direct.cmd, "lake");
    assert.equal(direct.cwd, "/lean");
  });

  console.log("helper builder");
  const { buildHelper, PRESETS: HELPER_PRESETS } = await import("../frontend/src/data/helper");
  for (const p of HELPER_PRESETS) {
    const built = buildHelper(p.name, p.rows);
    const call = `${p.name}(${built.params.map((q) => (q.kind === "color" ? "green" : "1")).join(", ")})`;
    const parsed = parseProgram(`${built.def}\n${call}`, 5);
    check(`preset "${p.title}": generated source parses (${built.def})`, () => {
      assert.equal(built.problem, "");
      assert.equal(parsed.ops.length, p.rows.length);
      assert.equal(parsed.statementLines, 2);
    });
  }
  check("the builder refuses what the language refuses", () => {
    assert.match(buildHelper("swap", HELPER_PRESETS[0].rows).problem, /already a command/);
    assert.match(buildHelper("9x", HELPER_PRESETS[0].rows).problem, /name/);
    assert.match(buildHelper("h", []).problem, /at least one command/);
    const five = Array.from({ length: 5 }, () => HELPER_PRESETS[0].rows[0]);
    assert.match(buildHelper("h", five).problem, /at most 4/);
    assert.match(buildHelper("h", [{ op: "paint", args: ["a", "b", "a"] }]).problem, /both a coordinate and a color/);
  });

  // results from before badges existed are credited when the page is opened
  const tokenG = await register("gina");
  const gina = userByName("gina")!;
  db.prepare("INSERT INTO scores (user_id, level_key, lines, time_ms, hints, optimality, time_points, points, created_at) VALUES (?, '1', 1, 1000, 0, 1000, 500, 2000, 0)").run(gina.id);
  const old = (await call("/api/achievements", undefined, tokenG)).data;
  check("old results are backfilled: a stored solve unlocks Hello, Swap", () => {
    assert.ok(old.unlocked.first_solve);
    assert.ok(!old.unlocked.helper);
  });

  console.log(`\n${passed} checks passed`);
  try {
    fs.rmSync(dir, { recursive: true, force: true }); // may fail on Windows while the database file is still open
  } catch {
    /* it is only a temp folder */
  }
  process.exit(0);
}

main().catch((e) => {
  console.error("\nFAILED:", e);
  process.exit(1);
});
