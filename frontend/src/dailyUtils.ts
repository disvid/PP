import type { Board, Color } from './data/levels'

/** What the Share button needs to know about a completed daily (the result itself lives in the database). */
export interface DailyResult {
  number: number
  lines: number
  optimalLines: number
  /** the solved board as emoji rows */
  rows: string[]
}

export const EMOJI: Record<Color, string> = {
  blue: '🟦',
  green: '🟩',
  red: '🟥',
  yellow: '🟨',
  purple: '🟪',
}

export const boardToEmoji = (board: Board): string[] => board.map((row) => row.map((b) => EMOJI[b.color]).join(''))

export const isOptimal = (r: Pick<DailyResult, 'lines' | 'optimalLines'>) => r.lines <= r.optimalLines

/** The text copied by the Share button. */
export function shareText(r: DailyResult, link: string): string {
  const head = isOptimal(r)
    ? `Swappr Daily #${r.number} - Optimal Score! ⭐`
    : `Swappr Daily #${r.number} - Solved in ${r.lines} lines (optimal ${r.optimalLines})`
  return [head, ...r.rows, link].join('\n')
}
