// Decides when a badge is earned. Each event (a solved level, a won battle, a finished tutorial) lists the badges it
// could have earned; db.unlockAchievement keeps the ones that are new and these functions return exactly those, so the
// caller can announce them. The badges themselves are described in frontend/src/data/achievements.ts.
import { AchievementKey, BUILTIN_LEVEL_COUNT } from "../frontend/src/data/achievements";
import { achievementsOf, dailyHistory, solveCounts, unlockAchievement } from "./db";
import { streakStats, StreakStats } from "./streak";
import { utcDate } from "./daily";

const unlockAll = (userId: number, keys: AchievementKey[]): AchievementKey[] => keys.filter((k) => unlockAchievement(userId, k));

export const usesHelper = (code: string) => /^[ \t]*def[ \t]/m.test(code);

export const streakOf = (userId: number, today = utcDate()): StreakStats =>
  streakStats(dailyHistory(userId).map((r) => r.date), today);

export interface SolveEvent {
  userId: number;
  code: string;
  lines: number;
  optimalLines: number;
  /** a built-in level; custom levels set their own "optimal" and are not eligible, or the badges could be farmed */
  builtin: boolean;
  /** this was today's daily (its completion has just been stored) */
  daily: boolean;
}

/** Call after the solve has been recorded, so the counts include it. */
export function onSolve(e: SolveEvent): AchievementKey[] {
  const earned: AchievementKey[] = [];
  if (e.builtin || e.daily) {
    if (usesHelper(e.code)) earned.push("helper");
    if (e.lines <= e.optimalLines) earned.push("matched_optimal");
    if (e.lines < e.optimalLines) earned.push("beat_optimal");
  }
  if (e.builtin) {
    earned.push("first_solve");
    const { solved, clean } = solveCounts(e.userId);
    if (solved >= 10) earned.push("solved_10");
    if (solved >= 30) earned.push("solved_30");
    if (solved >= BUILTIN_LEVEL_COUNT) earned.push("solved_all");
    if (clean >= 10) earned.push("no_hints_10");
  }
  if (e.daily) {
    earned.push("daily_first");
    if (e.lines <= e.optimalLines) earned.push("daily_optimal");
    const { current } = streakOf(e.userId);
    if (current >= 3) earned.push("streak_3");
    if (current >= 7) earned.push("streak_7");
    if (current >= 30) earned.push("streak_30");
  }
  return unlockAll(e.userId, earned);
}

/** A battle won by solving the puzzle (not by the opponent leaving). `compiles` is how many times the winner compiled. */
export function onBattleWin(userId: number, compiles: number): AchievementKey[] {
  return unlockAll(userId, compiles <= 1 ? ["battle_win", "battle_clean"] : ["battle_win"]);
}

export const onTutorialDone = (userId: number): AchievementKey[] => unlockAll(userId, ["tutorial"]);

/**
 * Badges that follow from results already on record: players who solved levels before badges existed get credit for them
 * the first time they look. (Badges that depend on how a solve was made, like using a helper, are not recoverable.)
 */
function backfill(userId: number, solved: number, clean: number, longestStreak: number) {
  const history = dailyHistory(userId);
  const earned: AchievementKey[] = [];
  if (solved >= 1) earned.push("first_solve");
  if (solved >= 10) earned.push("solved_10");
  if (solved >= 30) earned.push("solved_30");
  if (solved >= BUILTIN_LEVEL_COUNT) earned.push("solved_all");
  if (clean >= 10) earned.push("no_hints_10");
  if (history.length) earned.push("daily_first");
  if (history.some((h) => h.lines <= h.optimal_lines)) earned.push("daily_optimal", "matched_optimal");
  if (longestStreak >= 3) earned.push("streak_3");
  if (longestStreak >= 7) earned.push("streak_7");
  if (longestStreak >= 30) earned.push("streak_30");
  unlockAll(userId, earned);
}

/** Everything the Achievements page needs. */
export function achievementReport(userId: number) {
  const { solved, clean } = solveCounts(userId);
  const streak = streakOf(userId);
  backfill(userId, solved, clean, streak.longest);
  return {
    unlocked: Object.fromEntries(achievementsOf(userId).map((r) => [r.key, r.unlocked_at])),
    progress: { solved, clean, streak: streak.longest },
    streak,
  };
}
