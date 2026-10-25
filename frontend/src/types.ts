import type { Board } from './data/levels'

/** consecutive UTC days on which the daily was completed */
export interface Streak { current: number; longest: number; todayDone: boolean }

export interface EvalError { line: number; message: string; cells: [number, number][] }

export interface EvalResponse {
  engine: 'lean' | 'mock'
  steps: { line: number; board: Board; op?: { name: 'swap' | 'paint' | 'rotate'; args: string[] } }[]
  error: EvalError | null
  solved: boolean
  linesUsed: number
  message: string
  /** the server refused the run: a daily puzzle that was already completed */
  locked?: boolean
  /** badges this solve unlocked for the first time */
  achievements?: string[]
  /** on a daily: the streak including this solve */
  streak?: Streak | null
  score: {
    base: number
    optimality: number
    time: number
    hintPenalty: number
    total: number
    effectiveMs: number
    elapsedMs: number
    improved: boolean
    best: number
  } | null
}
