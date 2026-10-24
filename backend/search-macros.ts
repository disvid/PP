// Dev tool: exhaustive search for the shortest program on "paint these cells" levels (single color).
// A program is `def body` + n calls + r raw paints, so it costs 1 + n + r lines. The body is any
// canonical paint(x, y, color) x4 pattern over <= 6 parameters; calls bind parameters to 0..size-1.
// Run: npx tsx search-macros.ts <levelId>...
import { LEVELS } from "../frontend/src/data/levels";

const MAX_PARAMS = 6;

/** All restricted-growth strings of length n using at most MAX_PARAMS distinct symbols. */
function patterns(n: number): number[][] {
  const out: number[][] = [];
  const go = (cur: number[], used: number) => {
    if (cur.length === n) return void out.push([...cur]);
    for (let p = 0; p <= Math.min(used, MAX_PARAMS - 1); p++) {
      cur.push(p);
      go(cur, Math.max(used, p + 1));
      cur.pop();
    }
  };
  go([], 0);
  return out;
}

const popcount = (x: number) => {
  let c = 0;
  while (x) (x &= x - 1), c++;
  return c;
};

function solve(id: number) {
  const lv = LEVELS[id - 1];
  const size = lv.gridSize;
  const flatInit = lv.initialState.flat();
  const flatTgt = lv.targetState!.flat();
  // cells that must change; everything else must stay untouched
  let T = 0;
  flatTgt.forEach((b, i) => {
    if (b.color !== flatInit[i].color) T |= 1 << i;
  });
  const N = popcount(T);
  let best = { lines: N, desc: `raw: ${N} paints` };

  for (const pat of patterns(8)) {
    const k = Math.max(...pat) + 1;
    const masks = new Set<number>();
    const binding = new Map<number, number[]>();
    const total = size ** k;
    for (let code = 0; code < total; code++) {
      const v: number[] = [];
      let c = code;
      for (let i = 0; i < k; i++) (v[i] = c % size), (c = Math.floor(c / size));
      let m = 0;
      for (let j = 0; j < 4; j++) m |= 1 << (v[pat[2 * j + 1]] * size + v[pat[2 * j]]);
      if ((m & ~T) === 0) {
        masks.add(m);
        if (!binding.has(m)) binding.set(m, v);
      }
    }
    // singles stand for raw paint lines
    for (let i = 0; i < size * size; i++) if (T & (1 << i)) masks.add(1 << i);
    // keep only maximal masks: a superset is never worse for covering T
    const all = [...masks];
    const maximal = all.filter((a) => !all.some((b) => b !== a && (a & ~b) === 0));
    // minimum cover depth by BFS over unions
    let layer = new Set<number>([0]);
    for (let d = 1; d <= 6 && 1 + d < best.lines; d++) {
      const next = new Set<number>();
      for (const u of layer) for (const m of maximal) next.add(u | m);
      if (next.has(T)) {
        // reconstruct which masks to call
        const pick = (u: number, left: number): number[] | null => {
          if (u === T) return [];
          if (left === 0) return null;
          for (const m of maximal) {
            const r = pick(u | m, left - 1);
            if (r) return [m, ...r];
          }
          return null;
        };
        const chosen = pick(0, d)!;
        const names = "abcdef";
        const body = [0, 1, 2, 3].map((j) => `paint(${names[pat[2 * j]]}, ${names[pat[2 * j + 1]]}, ${flatTgt[Math.log2(T & -T)].color})`).join("; ");
        const params = names.slice(0, k).split("").join(", ");
        const calls = chosen.map((m) => binding.get(m) ? `call(${binding.get(m)!.join(", ")})` : `raw cell ${Math.log2(m)}`);
        best = { lines: 1 + d, desc: `def f(${params}) := ${body}  |  ${calls.join("  ")}` };
        break;
      }
      layer = next;
    }
  }
  console.log(`level ${id}: ${N} cells, best ${best.lines} lines (${best.desc})`);
}

for (const a of process.argv.slice(2)) solve(Number(a));
