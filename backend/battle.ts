// Real-time proof battles over Socket.IO: a matchmaking queue, then two players race on a brand-new puzzle.
//
//   client -> server   queue:join, queue:leave, battle:compile {code}, board_solved {code}, battle:forfeit
//   server -> client   queue:state, battle:start, battle:result, battle:opponent, battle:error, battle_over
//
// The server compiles every submission itself and forwards only the resulting board to the opponent (never the
// code). `board_solved` is a claim, not a fact: the server re-runs the proof and only a verified solution ends the
// battle, so the first *valid* claim wins and a client cannot fake a victory.
import crypto from "crypto";
import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { Board, Level } from "../frontend/src/data/levels";
import { verifyToken } from "./auth";
import { corsOrigin } from "./config";
import type { User } from "./db";
import { makeBoard } from "./engine";
import { generatePuzzle } from "./puzzleGenerator";
import { evaluateProof } from "./proof";

interface Player {
  socket: Socket;
  user: User;
  board: Board;
  lines: number;
  compiles: number;
  solved: boolean;
  error: boolean;
}

interface Battle {
  level: Level;
  players: [Player, Player];
  over: boolean;
}

export function attachBattles(httpServer: HttpServer) {
  const io = new Server(httpServer, { cors: { origin: corsOrigin } });
  const queue: { socket: Socket; user: User }[] = [];
  const battles = new Map<string, Battle>(); // socket id -> battle

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    const user = typeof token === "string" ? verifyToken(token) : undefined;
    if (!user) return next(new Error("unauthorized"));
    socket.data.user = user;
    next();
  });

  const unqueue = (socket: Socket) => {
    const i = queue.findIndex((q) => q.socket.id === socket.id);
    if (i >= 0) queue.splice(i, 1);
  };

  const finish = (battle: Battle, winner: Player | null, reason: "solved" | "forfeit") => {
    if (battle.over) return;
    battle.over = true;
    for (const p of battle.players) {
      p.socket.emit("battle_over", {
        reason,
        winner: winner?.user.name ?? null,
        youWon: winner === p,
        lines: Object.fromEntries(battle.players.map((q) => [q.user.name, q.lines])),
      });
      battles.delete(p.socket.id);
    }
  };

  io.on("connection", (socket) => {
    const user = socket.data.user as User;

    socket.on("queue:join", () => {
      if (battles.has(socket.id)) return;
      // one queue entry per player, even with two tabs open
      for (const q of [...queue]) if (q.user.id === user.id) unqueue(q.socket);
      queue.push({ socket, user });
      socket.emit("queue:state", { status: "searching" });

      if (queue.length < 2) return;
      const [a, b] = queue.splice(0, 2);
      // a puzzle made just for this match, from a fresh random seed: nobody has seen it, and it is not ranked
      const puzzle = generatePuzzle(crypto.randomBytes(8).toString("hex"), "Arena puzzle");
      const mk = (q: { socket: Socket; user: User }): Player => ({
        ...q,
        board: makeBoard(puzzle.level.initialState),
        lines: 0,
        compiles: 0,
        solved: false,
        error: false,
      });
      const battle: Battle = { level: puzzle.level, players: [mk(a), mk(b)], over: false };
      for (const p of battle.players) {
        battles.set(p.socket.id, battle);
        const opp = battle.players.find((q) => q !== p)!;
        p.socket.emit("battle:start", { level: puzzle.payload, opponent: opp.user.name });
      }
    });

    socket.on("queue:leave", () => {
      unqueue(socket);
      socket.emit("queue:state", { status: "idle" });
    });

    socket.on("battle:compile", async (payload: { code?: unknown }) => {
      const battle = battles.get(socket.id);
      const me = battle?.players.find((p) => p.socket.id === socket.id);
      if (!battle || !me || battle.over) return void socket.emit("battle:error", { message: "No battle in progress" });
      const code = payload?.code;
      if (typeof code !== "string" || code.length > 5000) return void socket.emit("battle:error", { message: "Bad proof" });

      const result = await evaluateProof(battle.level, code);
      if (battle.over) return; // the other player finished while this compiled
      const opp = battle.players.find((p) => p !== me)!;
      me.board = result.steps.length ? result.steps[result.steps.length - 1].board : makeBoard(battle.level.initialState);
      me.lines = result.linesUsed;
      me.compiles++;
      me.error = !!result.error;
      me.solved = result.solved;

      socket.emit("battle:result", { board: me.board, error: result.error, solved: result.solved, linesUsed: result.linesUsed, message: result.message });
      // the live view of this player's progress for the opponent
      opp.socket.emit("battle:opponent", { board: me.board, error: me.error, solved: me.solved, lines: me.lines, compiles: me.compiles });
    });

    // "my board is solved": verified by the server, and the first verified claim ends the battle
    socket.on("board_solved", async (payload: { code?: unknown }) => {
      const battle = battles.get(socket.id);
      const me = battle?.players.find((p) => p.socket.id === socket.id);
      if (!battle || !me || battle.over) return void socket.emit("battle:error", { message: "No battle in progress" });
      const code = payload?.code;
      if (typeof code !== "string" || code.length > 5000) return void socket.emit("battle:error", { message: "Bad proof" });

      const result = await evaluateProof(battle.level, code);
      if (battle.over) return; // the opponent's claim was verified first
      if (!result.solved) return void socket.emit("battle:error", { message: "That proof does not solve the puzzle" });
      me.lines = result.linesUsed;
      me.solved = true;
      finish(battle, me, "solved");
    });

    socket.on("battle:forfeit", () => {
      const battle = battles.get(socket.id);
      if (!battle) return;
      finish(battle, battle.players.find((p) => p.socket.id !== socket.id) ?? null, "forfeit");
    });

    socket.on("disconnect", () => {
      unqueue(socket);
      const battle = battles.get(socket.id);
      if (battle) finish(battle, battle.players.find((p) => p.socket.id !== socket.id) ?? null, "forfeit");
    });
  });

  return io;
}
