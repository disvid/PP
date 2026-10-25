import { useState } from 'react'

export interface DailyStats {
  /** the current UTC date, from the server */
  today: string
  current: number
  longest: number
  todayDone: boolean
  solved: number
  optimal: number
  history: { date: string; number: number; lines: number; optimalLines: number }[]
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
/** the first daily (#1) was 2026-01-01: nothing to see before it */
const FIRST_MONTH = '2026-01'

const pad = (n: number) => String(n).padStart(2, '0')
const monthOf = (date: string) => date.slice(0, 7)
const shiftMonth = (ym: string, by: number) => {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + by, 1))
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`
}

function Tile({ label, value, testId }: { label: string; value: string | number; testId: string }) {
  return (
    <div className="border-[3px] border-ink bg-card px-3 py-2 text-center" data-testid={testId}>
      <p className="text-2xl font-extrabold leading-none">{value}</p>
      <p className="mt-1 font-mono text-[0.65rem] font-bold uppercase tracking-wide">{label}</p>
    </div>
  )
}

/** Streak numbers plus a month calendar of the dailies the player has solved. */
export default function StreakCalendar({ stats }: { stats: DailyStats }) {
  const [month, setMonth] = useState(monthOf(stats.today))
  const solved = new Map(stats.history.map((h) => [h.date, h]))

  const [y, m] = month.split('-').map(Number)
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7 // Monday first
  const cells: (string | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${pad(i + 1)}`),
  ]

  return (
    <div data-testid="streak-calendar">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="Current streak" value={`🔥 ${stats.current}`} testId="stat-current" />
        <Tile label="Best streak" value={stats.longest} testId="stat-longest" />
        <Tile label="Dailies solved" value={stats.solved} testId="stat-solved" />
        <Tile label="Optimal solves" value={stats.optimal} testId="stat-optimal" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="btn-paper px-3 py-1 text-sm"
          aria-label="Previous month"
          disabled={month <= FIRST_MONTH}
          onClick={() => setMonth(shiftMonth(month, -1))}
        >
          ←
        </button>
        <p className="text-lg font-extrabold uppercase tracking-tight" data-testid="calendar-month">
          {MONTHS[m - 1]} {y}
        </p>
        <button
          className="btn-paper px-3 py-1 text-sm"
          aria-label="Next month"
          disabled={month >= monthOf(stats.today)}
          onClick={() => setMonth(shiftMonth(month, 1))}
        >
          →
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="font-mono text-[0.65rem] font-bold uppercase">{d}</span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />
          const day = Number(date.slice(8))
          const hit = solved.get(date)
          const isToday = date === stats.today
          const future = date > stats.today
          const optimal = hit && hit.lines <= hit.optimalLines
          const look = hit
            ? optimal
              ? 'bg-neon text-[#0a0a0a]'
              : 'bg-aqua text-[#0a0a0a]'
            : isToday
              ? 'bg-card outline outline-[3px] outline-offset-1 outline-magenta'
              : future
                ? 'bg-card opacity-30'
                : 'bg-card opacity-70'
          return (
            <span
              key={date}
              data-testid="calendar-day"
              data-date={date}
              data-solved={hit ? (optimal ? 'optimal' : 'yes') : undefined}
              title={hit ? `Daily #${hit.number}: ${hit.lines} lines (optimal ${hit.optimalLines})` : isToday ? 'Today' : date}
              className={`flex h-10 flex-col items-center justify-center border-[3px] border-ink font-mono text-xs font-bold leading-none ${look}`}
            >
              {day}
              {hit && <span className="mt-0.5 text-[0.6rem]">{optimal ? '★' : '✓'}</span>}
            </span>
          )
        })}
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.7rem] font-medium">
        <span><span className="mr-1 inline-block h-3 w-3 border-2 border-ink bg-neon align-middle" />optimal ★</span>
        <span><span className="mr-1 inline-block h-3 w-3 border-2 border-ink bg-aqua align-middle" />solved ✓</span>
        <span><span className="mr-1 inline-block h-3 w-3 border-2 border-magenta bg-card align-middle" />today</span>
      </p>
    </div>
  )
}
