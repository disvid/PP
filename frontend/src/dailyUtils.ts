import { addMinutes, differenceInCalendarDays, format } from 'date-fns'
import { LEVELS } from './data/levels'
import type { Board, Color, Level } from './data/levels'

/** Puzzle #1. */
const EPOCH = new Date(2026, 0, 1)
/** The tutorial levels are too short for a daily puzzle. */
const POOL = LEVELS.filter((l) => l.id >= 6)

/** A Date whose local fields show the current UTC calendar day, so every player gets the same puzzle on the same day. */
const utc = (now: Date) => addMinutes(now, now.getTimezoneOffset())

export const dateKey = (now = new Date()) => format(utc(now), 'yyyy-MM-dd')
export const dailyNumber = (now = new Date()) => differenceInCalendarDays(utc(now), EPOCH) + 1

/** Seeded pick: the same date string always maps to the same level. */
export function dailyLevel(key: string): Level {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193) >>> 0
  return POOL[h % POOL.length]
}

export interface DailyRecord {
  date: string
  number: number
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

export const loadDaily = (date: string): DailyRecord | null => readAll()[date] ?? null

/** Stores the result for the day, keeping the better one (fewer lines, then faster) if it was solved before. */
export function saveDaily(rec: DailyRecord): DailyRecord {
  const all = readAll()
  const prev = all[rec.date]
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
