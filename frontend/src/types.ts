import type { Board } from './data/levels'

export interface EvalError { line: number; message: string; cells: [number, number][] }

export interface EvalResponse {
  engine: 'lean' | 'mock'
  steps: { line: number; board: Board; op?: { name: 'swap' | 'paint' | 'rotate'; args: string[] } }[]
  error: EvalError | null
  solved: boolean
  linesUsed: number
  message: string
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
