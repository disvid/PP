// Reference solutions, one per level, each exactly `optimalLines` long. Used by `npm run verify` (which proves them)
// and by the battle test bot.
export const j = (...lines: string[]) => lines.join("\n");
const FOUR = "def four(a, b) := paint(a, a, red); paint(b, b, red); paint(a, b, red); paint(b, a, red)";
const ROW = (col: string) => `def row(a, b, c, d, y${col === "col" ? ", col" : ""}) := paint(a, y, ${col}); paint(b, y, ${col}); paint(c, y, ${col}); paint(d, y, ${col})`;

/** One reference solution per level, each exactly optimalLines long. */
export const SOLUTIONS: Record<number, string> = {
  1: "paint(1, 1, green)",
  2: j("paint(0, 0, red)", "paint(2, 2, red)"),
  3: "swap(0, 0, 2, 2)",
  4: j("def spin(a, b) := rotate(a, b); rotate(a, b)", "spin(1, 1)"),
  5: j("def go(a, b, c, d) := swap(a, b, c, d); rotate(c, d); rotate(c, d)", "go(0, 1, 2, 1)"),
  6: j("swap(0, 0, 2, 0)", "paint(1, 0, green)"),
  7: j("swap(1, 1, 1, 0)", "swap(2, 2, 2, 0)"),
  8: j("def f(a, b, c, d, e) := swap(a, b, c, b); paint(c, d, blue); paint(c, e, blue)", "f(0, 0, 1, 1, 2)"),
  9: j("def f(a, b, c, d, e) := swap(a, b, a, c); swap(d, e, d, b); paint(e, e, red)", "f(2, 0, 2, 0, 1)"),
  10: j(
    "def f(a, b, c, d, e) := swap(a, b, c, b); swap(d, e, c, e); swap(d, b, d, c); swap(a, e, a, c)",
    "f(2, 0, 1, 0, 2)",
    "paint(1, 1, yellow)",
  ),
  11: j(FOUR, "four(0, 3)"),
  12: j(
    "def f(a, b, c, d) := paint(a, a, red); paint(a, b, red); paint(b, a, red); paint(c, d, red)",
    "f(1, 2, 1, 0)",
    "f(1, 3, 0, 1)",
  ),
  13: j(ROW("red"), "row(0, 1, 2, 3, 0)", "row(0, 1, 2, 3, 3)"),
  14: j(FOUR, "four(0, 3)", "four(1, 2)"),
  15: j(ROW("col"), "row(0, 1, 2, 3, 0, red)", "row(0, 1, 2, 3, 3, yellow)"),
  16: j(
    "def rect(a, b, c, d) := paint(a, b, green); paint(c, b, green); paint(a, d, green); paint(c, d, green)",
    "rect(1, 0, 3, 2)",
    "rect(0, 1, 2, 3)",
  ),
  17: j(
    "def f(a, b, c, d) := paint(a, b, red); paint(a, c, red); paint(b, a, red); paint(b, d, red)",
    "f(3, 0, 1, 0)",
    "f(3, 2, 3, 0)",
    "f(1, 0, 3, 2)",
  ),
  18: j(
    "def f(a, b, c, d) := paint(a, a, red); paint(a, b, red); paint(b, a, red); paint(c, d, red)",
    "f(3, 1, 1, 0)",
    "f(0, 2, 3, 0)",
    "f(3, 2, 1, 2)",
  ),
  19: j(
    "def mv(a, b, c, e, f, d) := swap(a, b, c, c); paint(c, c, green); swap(e, f, d, d); paint(d, d, green)",
    "mv(1, 0, 0, 3, 1, 1)",
    "mv(0, 2, 2, 2, 3, 3)",
  ),
  20: j(
    "def fix(a, b, c, d) := swap(a, b, c, d); paint(a, b, red); paint(c, d, red); rotate(c, d)",
    "fix(0, 0, 2, 0)",
    "fix(3, 1, 1, 1)",
    "fix(0, 2, 3, 2)",
    "fix(2, 3, 1, 3)",
  ),
  21: j("swap(1, 0, 3, 0)", "swap(0, 1, 0, 3)"),
  22: j("swap(1, 1, 1, 0)", "swap(2, 2, 2, 0)"),
  23: j("paint(3, 0, yellow)", "paint(3, 1, yellow)"),
};

