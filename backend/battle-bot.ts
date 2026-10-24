// Test bot for battles. Usage: npx tsx battle-bot.ts <name> <partial|solve|idle>
//   partial: compile a harmless one-liner after the countdown, then leave after a while (forfeit)
//   solve:   compile the reference solution right after the countdown
//   idle:    just sit in the battle
import { createRequire } from "module";
import { SOLUTIONS } from "./solutions";

const require2 = createRequire(__dirname + "/../frontend/package.json");
const { io } = require2("socket.io-client");

const API = process.env.API_URL ?? "http://localhost:3000";
const [name = "erin", mode = "partial"] = process.argv.slice(2);

async function main() {
  const login = await fetch(`${API}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
  const { token } = (await login.json()) as { token: string };
  const socket = io(API, { auth: { token } });
  const log = (...a: unknown[]) => console.log(`[${name}]`, ...a);

  socket.on("connect", () => {
    log("connected, joining queue");
    socket.emit("queue:join");
  });
  socket.on("battle:start", (s: { levelId: number; opponent: string; startsAt: number; now: number }) => {
    log("battle:start", JSON.stringify(s));
    const wait = Math.max(0, s.startsAt - Date.now()) + 300;
    if (mode === "idle") return;
    setTimeout(() => {
      const code = mode === "solve" ? SOLUTIONS[s.levelId] : "paint(0, 0, red)";
      log("compiling", JSON.stringify(code.slice(0, 40)));
      socket.emit("battle:compile", { code });
    }, wait);
    if (mode === "partial") setTimeout(() => { log("leaving"); socket.disconnect(); process.exit(0); }, wait + 40000);
  });
  socket.on("battle:result", (r: { solved: boolean; linesUsed: number; error: unknown }) => log("battle:result", JSON.stringify({ solved: r.solved, lines: r.linesUsed, error: r.error })));
  socket.on("battle:opponent", (o: unknown) => log("battle:opponent", JSON.stringify(o).slice(0, 120)));
  socket.on("battle:over", (o: unknown) => {
    log("battle:over", JSON.stringify(o));
    setTimeout(() => process.exit(0), 300);
  });
  socket.on("battle:error", (e: unknown) => log("battle:error", JSON.stringify(e)));
  socket.on("connect_error", (e: Error) => log("connect_error", e.message));
}
void main();
