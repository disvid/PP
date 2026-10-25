// Check a proof from the command line, with no browser and no account.
//
//   npm run check -- --level 4 "rotate(1, 1)" "rotate(1, 1)"
//   npm run check -- --level 9 --file proof.txt --steps
//   npm run check -- --custom <base64url level from the Level Builder> "paint(0, 0, red)"
//   npm run check -- --help
//
// Every argument that is not a flag is one line of the proof. It prints the start board, the target (with locked blocks
// marked), the verdict, and with --steps the board after every command.
import fs from "node:fs";
import { Board, customToLevel, decodeCustom, Level, LEVELS } from "../frontend/src/data/levels";
import { countLines } from "../frontend/src/data/scoring";
import { evaluateProof } from "./proof";

const HELP = `usage: npm run check -- (--level <id> | --custom <payload>) [--file <proof.txt>] [--steps] ["<line>" ...]

  --level <id>       one of the ${LEVELS.length} built-in levels
  --custom <payload> a level from the Level Builder (the base64url text after ?level= in a share link)
  --file <path>      read the proof from a file instead of the command line
  --steps            print the board after every command
  --help             this text`;

const LETTER = { blue: "B", green: "G", red: "R", yellow: "Y", purple: "P" } as const;
const ARROW = ["^", ">", "v", "<"];

/** A board as rows of two-character cells: the color letter, then the arrow (or a space), with a padlock mark for locked blocks. */
function draw(board: Board, locked: [number, number][] = []): string[] {
  return board.map((row, y) =>
    row.map((b, x) => `${LETTER[b.color]}${b.rot === undefined ? " " : ARROW[b.rot]}${locked.some(([lx, ly]) => lx === x && ly === y) ? "#" : " "}`).join(""),
  );
}

/** Boards side by side, with a title over each. */
function sideBySide(items: { title: string; rows: string[] }[]): string {
  const width = (rows: string[]) => Math.max(...rows.map((r) => r.length));
  const heads = items.map((i) => i.title.padEnd(Math.max(width(i.rows), i.title.length)));
  const lines = items[0].rows.map((_, k) => items.map((i, n) => (i.rows[k] ?? "").padEnd(heads[n].length)).join("    "));
  return [heads.join("    "), ...lines].join("\n");
}

async function main() {
  const argv = process.argv.slice(2);
  const take = (flag: string) => {
    const i = argv.indexOf(flag);
    if (i < 0) return undefined;
    const [, value] = argv.splice(i, 2);
    return value;
  };
  if (argv.includes("--help") || argv.length === 0) return void console.log(HELP);
  const steps = argv.includes("--steps");
  if (steps) argv.splice(argv.indexOf("--steps"), 1);
  const levelId = take("--level");
  const custom = take("--custom");
  const file = take("--file");

  let level: Level | undefined;
  if (custom) level = customToLevel(decodeCustom(custom));
  else if (levelId) level = LEVELS.find((l) => String(l.id) === levelId);
  if (!level) {
    console.error(`Pick a level with --level <1-${LEVELS.length}> or --custom <payload>. Try --help.`);
    process.exitCode = 2;
    return;
  }

  const code = file ? fs.readFileSync(file, "utf8") : argv.join("\n");
  console.log(`${level.custom ? "Custom level" : `Level ${level.id}`}: ${level.title}   (max ${level.parLimit} lines, optimal ${level.optimalLines})`);
  console.log(sideBySide([{ title: "start", rows: draw(level.initialState, level.locked) }, ...(level.targetState ? [{ title: "target", rows: draw(level.targetState, level.locked) }] : [])]));
  if (level.locked?.length) console.log("(# marks a locked block: no command can touch it)");
  if (level.property) console.log("Goal: satisfy the level's theorem.");
  console.log("");

  const r = await evaluateProof(level, code);
  if (steps) {
    r.steps.forEach((s, i) => {
      console.log(`after line ${s.line}: ${s.op ? `${s.op.name}(${s.op.args.join(", ")})` : ""}`);
      console.log(draw(s.board, level!.locked).map((row) => `  ${row}`).join("\n"));
      if (i === r.steps.length - 1) console.log("");
    });
  }
  if (r.error) {
    console.log(`REJECTED at line ${r.error.line}: ${r.error.message}`);
    if (r.error.cells.length) console.log(`  highlighted blocks: ${r.error.cells.map(([x, y]) => `(${x}, ${y})`).join(" ")}`);
    process.exitCode = 1;
    return;
  }
  const lines = countLines(code);
  console.log(`${r.solved ? "SOLVED" : "NOT SOLVED"}: ${r.message}   [engine: ${r.engine}, ${lines} line${lines === 1 ? "" : "s"} of ${level.parLimit}, optimal ${level.optimalLines}]`);
  if (r.solved && lines < level.optimalLines) console.log("That beats the known optimum!");
  process.exitCode = r.solved ? 0 : 1;
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(2);
});
