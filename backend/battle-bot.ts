// Test opponent for battles. Usage: npx tsx battle-bot.ts <name> <partial|solve|idle>
//   partial: compile a harmless one-liner, then leave after a while (forfeit)
//   solve:   work out a shortest proof for the generated puzzle, compile it and claim the win (board_solved)
//   idle:    just sit in the battle
//   peek:    sit in the battle and print a shortest proof for the puzzle (to test the UI by hand)
// Env: API_URL (default http://localhost:3000), BOT_PASSWORD (default below; the account is created on first use).
import { createRequire } from "module";
import { customToLevel, decodeCustom } from "../frontend/src/data/levels";
import { solveSequence } from "./hint";
import { moveToSource } from "./puzzleGenerator";

const require2 = createRequire(__dirname + "/../frontend/package.json");
const { io } = require2("socket.io-client");

const API = process.env.API_URL ?? "http://localhost:3000";
const PASSWORD = process.env.BOT_PASSWORD ?? "battle-bot-password";
const [name = "erin", mode = "partial"] = process.argv.slice(2);

async function main() {
  const login = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password: PASSWORD }),
  });
  const body = (await login.json()) as { token?: string; error?: string };
  if (!body.token) throw new Error(`login failed: ${body.error}`);
  const socket = io(API, { auth: { token: body.token } });
  const log = (...a: unknown[]) => console.log(`[${name}]`, ...a);
  let lastCode = "";

  socket.on("connect", () => {
    log("connected, joining queue");
    socket.emit("queue:join");
  });
  socket.on("battle:start", (s: { level: string; opponent: string }) => {
    const level = customToLevel(decodeCustom(s.level));
    log("battle:start vs", s.opponent, `(${level.gridSize}x${level.gridSize}, par ${level.parLimit}, optimal ${level.optimalLines})`);
    if (mode === "peek") {
      log("SOLUTION " + JSON.stringify((solveSequence(level, level.initialState) ?? []).map(moveToSource).join("\n")));
      return;
    }
    if (mode === "idle") return;
    const code =
      mode === "solve" ? (solveSequence(level, level.initialState) ?? []).map(moveToSource).join("\n") : "paint(0, 0, red)";
    setTimeout(() => {
      lastCode = code;
      log("compiling", JSON.stringify(code.slice(0, 40)));
      socket.emit("battle:compile", { code });
    }, 1000);
    if (mode === "partial") setTimeout(() => { log("leaving"); socket.disconnect(); process.exit(0); }, 40000);
  });
  socket.on("battle:result", (r: { solved: boolean; linesUsed: number; error: unknown }) => {
    log("battle:result", JSON.stringify({ solved: r.solved, lines: r.linesUsed, error: r.error }));
    if (r.solved) {
      log("claiming the win: board_solved");
      socket.emit("board_solved", { code: lastCode });
    }
  });
  socket.on("battle:opponent", (o: unknown) => log("battle:opponent", JSON.stringify(o).slice(0, 120)));
  socket.on("battle_over", (o: unknown) => {
    log("battle_over", JSON.stringify(o));
    setTimeout(() => process.exit(0), 300);
  });
  socket.on("battle:error", (e: unknown) => log("battle:error", JSON.stringify(e)));
  socket.on("connect_error", (e: Error) => log("connect_error", e.message));
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
