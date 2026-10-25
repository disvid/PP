import type { Board, Color } from './data/levels'

/** What the Share button needs to know about a completed daily (the result itself lives in the database). */
export interface DailyResult {
  number: number
  lines: number
  optimalLines: number
  /** the solved board as emoji rows */
  rows: string[]
  /** the current daily streak, counting today */
  streak?: number
  /** the server-side clock when the proof was accepted */
  timeMs?: number | null
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

const MAX_BAR = 12

/**
 * One square per line of the proof, Wordle style: green while you are within the optimal length, yellow for every
 * line beyond it, and a star when you matched or beat the optimum.
 */
export function effortBar(lines: number, optimalLines: number): string {
  const green = Math.min(lines, optimalLines, MAX_BAR)
  const yellow = Math.min(Math.max(0, lines - optimalLines), MAX_BAR - green)
  return '🟩'.repeat(green) + '🟨'.repeat(yellow) + (lines <= optimalLines ? '⭐' : '')
}

export const fmtTime = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** The lines of the share card, also shown on screen. */
export function shareLines(r: DailyResult): { head: string; bar: string; detail: string; rows: string[] } {
  const streak = r.streak && r.streak > 0 ? ` 🔥${r.streak}` : ''
  const detail =
    (isOptimal(r) ? `${r.lines} lines, optimal!` : `${r.lines} lines (optimal ${r.optimalLines})`) +
    (r.timeMs ? ` · ⏱ ${fmtTime(r.timeMs)}` : '')
  return { head: `Swappr Daily #${r.number}${streak}`, bar: effortBar(r.lines, r.optimalLines), detail, rows: r.rows }
}

/** The text copied by the Share button. */
export function shareText(r: DailyResult, link: string): string {
  const { head, bar, detail, rows } = shareLines(r)
  return [head, `${bar} ${detail}`, '', ...rows, '', link].join('\n')
}
