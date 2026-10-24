// The Daily Theorem: one procedurally generated puzzle per UTC day, identical for every player.
// The generator is seeded with the date, so any server instance produces the same puzzle; it is also saved in the
// database (with a shortest proof) so that the day's puzzle can be recognised later when a proof is submitted.
import { levelKey } from "../frontend/src/data/levels";
import { DailyPuzzleRow, dailyByDate, saveDailyPuzzle } from "./db";
import { generatePuzzle, moveToSource } from "./puzzleGenerator";

const EPOCH = Date.UTC(2026, 0, 1); // puzzle #1

export const utcDate = (now = new Date()) => now.toISOString().slice(0, 10);

let cache: DailyPuzzleRow | null = null;

/** Today's (UTC) puzzle, generated and stored on first use. */
export function todaysDaily(): DailyPuzzleRow {
  const date = utcDate();
  if (cache?.date === date) return cache;

  let row = dailyByDate(date);
  if (!row) {
    const [y, m, d] = date.split("-").map(Number);
    const number = Math.floor((Date.UTC(y, m - 1, d) - EPOCH) / 86_400_000) + 1;
    const puzzle = generatePuzzle(`proof-puzzle-daily-${date}`, `Daily Theorem #${number}`);
    row = {
      date,
      number,
      level_key: levelKey(puzzle.level),
      payload: puzzle.payload,
      optimal_lines: puzzle.generated.optimalLines,
      // the exact shortest proof from the BFS solver: only ever sent to players who have finished the puzzle
      solution: puzzle.generated.solution.map(moveToSource).join("\n"),
    };
    saveDailyPuzzle(row);
    row = dailyByDate(date) ?? row; // another process may have stored it first: use the stored one
  }
  cache = row;
  return row;
}
