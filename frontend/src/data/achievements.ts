// The badges a player can earn. Shared by the backend (which decides when one is unlocked, see backend/achievements.ts)
// and the React app (which draws them), so keep this file dependency-free.

export type AchievementKey =
  | 'tutorial'
  | 'first_solve'
  | 'helper'
  | 'matched_optimal'
  | 'beat_optimal'
  | 'solved_10'
  | 'solved_30'
  | 'solved_all'
  | 'no_hints_10'
  | 'daily_first'
  | 'daily_optimal'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'battle_win'
  | 'battle_clean'

export type Tier = 'bronze' | 'silver' | 'gold'

/** What a count-based badge is measured against, so the page can show "7/10". */
export type ProgressKind = 'solved' | 'clean' | 'streak'

export interface AchievementDef {
  key: AchievementKey
  title: string
  description: string
  icon: string
  tier: Tier
  progress?: { of: ProgressKind; goal: number }
}

/** Number of built-in levels (kept in step with LEVELS; backend/verify-levels.ts asserts it). */
export const BUILTIN_LEVEL_COUNT = 67

export const ACHIEVEMENTS: AchievementDef[] = [
  { key: 'tutorial', title: 'Graduate', description: 'Finish the interactive tutorial.', icon: '🎓', tier: 'bronze' },
  { key: 'first_solve', title: 'Hello, Swap', description: 'Solve your first level.', icon: '👋', tier: 'bronze' },
  { key: 'helper', title: 'Macro Maker', description: 'Solve a level with a helper (def).', icon: '🧩', tier: 'silver' },
  { key: 'matched_optimal', title: 'Right on the Money', description: 'Solve a level in exactly the optimal number of lines.', icon: '🎯', tier: 'silver' },
  { key: 'beat_optimal', title: 'Beat the Machine', description: 'Solve a level in fewer lines than the known optimum.', icon: '🤖', tier: 'gold' },
  { key: 'solved_10', title: 'Double Digits', description: 'Solve 10 levels.', icon: '🔟', tier: 'bronze', progress: { of: 'solved', goal: 10 } },
  { key: 'solved_30', title: 'Getting Serious', description: 'Solve 30 levels.', icon: '💪', tier: 'silver', progress: { of: 'solved', goal: 30 } },
  { key: 'solved_all', title: 'Completionist', description: `Solve all ${BUILTIN_LEVEL_COUNT} levels.`, icon: '👑', tier: 'gold', progress: { of: 'solved', goal: BUILTIN_LEVEL_COUNT } },
  { key: 'no_hints_10', title: 'Self-Taught', description: 'Solve 10 levels without using a single hint.', icon: '🧠', tier: 'silver', progress: { of: 'clean', goal: 10 } },
  { key: 'daily_first', title: 'Daily Driver', description: 'Complete a Daily Theorem.', icon: '📅', tier: 'bronze' },
  { key: 'daily_optimal', title: 'Daily Perfection', description: 'Complete a Daily Theorem with an optimal-length proof.', icon: '⭐', tier: 'silver' },
  { key: 'streak_3', title: 'Hat Trick', description: 'Complete the Daily 3 days in a row.', icon: '🔥', tier: 'bronze', progress: { of: 'streak', goal: 3 } },
  { key: 'streak_7', title: 'Week Warrior', description: 'Complete the Daily 7 days in a row.', icon: '🗓️', tier: 'silver', progress: { of: 'streak', goal: 7 } },
  { key: 'streak_30', title: 'Unstoppable', description: 'Complete the Daily 30 days in a row.', icon: '🌋', tier: 'gold', progress: { of: 'streak', goal: 30 } },
  { key: 'battle_win', title: 'Duelist', description: 'Win a battle by solving the puzzle first.', icon: '⚔️', tier: 'silver' },
  { key: 'battle_clean', title: 'Flawless Duel', description: 'Win a battle with your very first compile.', icon: '💎', tier: 'gold' },
]

export const ACHIEVEMENT_BY_KEY: Record<string, AchievementDef> = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.key, a]))
