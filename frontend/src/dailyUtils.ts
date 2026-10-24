import type { Board, Color } from './data/levels'

export interface DailyRecord {
  date: string
  number: number
  /** 0: the daily puzzle is generated, not one of the numbered levels */
  levelId: number
  lines: number
  optimalLines: number
  elapsedMs: number | null
  total: number | null
  /** the final board as emoji rows */
  rows: string[]
}

const KEY = 'pp_daily'

function readAll(): Record<string, DailyRecord> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, DailyRecord>
  } catch {
    return {}
  }
}

export const loadDaily = (date: string): DailyRecord | null => {
  const r = readAll()[date]
  // results saved before the daily puzzle was generated belong to a numbered level (levelId > 0), not to today's puzzle
  return r && r.levelId === 0 ? r : null
}

/** Stores the result for the day, keeping the better one (fewer lines, then faster) if it was solved before. */
export function saveDaily(rec: DailyRecord): DailyRecord {
  const all = readAll()
  const stored = all[rec.date]
  const prev = stored && stored.levelId === 0 ? stored : undefined // see loadDaily: older results are not today's puzzle
  const better = !prev || rec.lines < prev.lines || (rec.lines === prev.lines && (rec.elapsedMs ?? Infinity) < (prev.elapsedMs ?? Infinity))
  if (better) all[rec.date] = rec
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    /* storage unavailable: the result just is not remembered */
  }
  return better ? rec : prev
}

export const EMOJI: Record<Color, string> = {
  blue: '🟦',
  green: '🟩',
  red: '🟥',
  yellow: '🟨',
  purple: '🟪',
}

export const boardToEmoji = (board: Board): string[] => board.map((row) => row.map((b) => EMOJI[b.color]).join(''))

export const isOptimal = (r: DailyRecord) => r.lines <= r.optimalLines

/** The text copied by the Share button. */
export function shareText(r: DailyRecord, link: string): string {
  const head = isOptimal(r)
    ? `Proof Puzzle Daily #${r.number} - Optimal Score! ⭐`
    : `Proof Puzzle Daily #${r.number} - Solved in ${r.lines} lines (optimal ${r.optimalLines})`
  return [head, ...r.rows, link].join('\n')
}
