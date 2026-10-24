// Shared by the backend (authoritative scoring) and the UI (score breakdown).

/** Flat reward for solving the level. */
export const COMPLETION_POINTS = 500
/** Optimality = OPTIMALITY_BASE * min(1, optimalLines / actualLines). */
export const OPTIMALITY_BASE = 1000
export const TIME_BONUS_MAX = 500
export const TIME_LIMIT_MS = 5 * 60 * 1000
export const HINT_POINTS = 150
export const HINT_TIME_MS = 30 * 1000

/** Lines that count against par: everything except blank lines and `--` comments. */
export const countLines = (code: string) => code.split('\n').filter((l) => l.split('--')[0].trim() !== '').length

export interface ScoreInput {
  /** shortest known valid proof for the level (Level.optimalLines) */
  optimalLines: number
  lines: number
  elapsedMs: number
  hints: number
}

export interface Score {
  base: number
  /** OPTIMALITY_BASE * (optimalLines / actualLines), capped at the full amount when the proof is as short as the optimum. */
  optimality: number
  time: number
  hintPenalty: number
  total: number
  /** Elapsed time including the per-hint time penalty. */
  effectiveMs: number
}

export function computeScore({ optimalLines, lines, elapsedMs, hints }: ScoreInput): Score {
  const ratio = Math.min(1, optimalLines / Math.max(lines, 1))
  const optimality = Math.round(OPTIMALITY_BASE * ratio)
  const effectiveMs = elapsedMs + hints * HINT_TIME_MS
  const time = Math.round(TIME_BONUS_MAX * Math.max(0, 1 - effectiveMs / TIME_LIMIT_MS))
  const hintPenalty = hints * HINT_POINTS
  return {
    base: COMPLETION_POINTS,
    optimality,
    time,
    hintPenalty,
    total: Math.max(0, COMPLETION_POINTS + optimality + time - hintPenalty),
    effectiveMs,
  }
}

export const MAX_SCORE = COMPLETION_POINTS + OPTIMALITY_BASE + TIME_BONUS_MAX
