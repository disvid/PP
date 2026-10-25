// Daily streaks: consecutive UTC days on which the player completed the Daily Theorem.

const DAY_MS = 86_400_000;

const toMs = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
const toDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const addDays = (date: string, n: number) => toDate(toMs(date) + n * DAY_MS);

export interface StreakStats {
  /** consecutive days ending today, or ending yesterday while today's daily is still open (the streak is alive until midnight) */
  current: number;
  longest: number;
  /** today's daily is already done */
  todayDone: boolean;
}

/** `dates` are YYYY-MM-DD strings in any order, duplicates ignored; `today` is the current UTC date. */
export function streakStats(dates: string[], today: string): StreakStats {
  const set = new Set(dates);
  const todayDone = set.has(today);

  let current = 0;
  for (let d = todayDone ? today : addDays(today, -1); set.has(d); d = addDays(d, -1)) current++;

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of [...set].sort()) {
    run = prev !== null && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  return { current, longest, todayDone };
}
