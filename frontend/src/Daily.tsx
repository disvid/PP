import { useCallback, useEffect, useMemo, useState } from 'react'
import Game from './Game'
import type { GameStore, SolveInfo } from './Game'
import StreakCalendar from './StreakCalendar'
import type { DailyStats } from './StreakCalendar'
import { api } from './api'
import { customToLevel, decodeCustom } from './data/levels'
import { boardToEmoji, isOptimal, shareLines, shareText } from './dailyUtils'
import type { Streak } from './types'

interface Completion {
  lines: number
  optimalLines: number
  points: number | null
  timeMs?: number | null
  canRevealSolution: boolean
}

interface DailyInfo {
  date: string
  number: number
  /** the generated puzzle as a base64url custom-level payload */
  level: string
  /** this player's result for today, or null while the attempt is still unused */
  completion: Completion | null
  streak: Streak | null
}

const LOCKED = 'Daily complete. One valid proof per day: come back after 00:00 UTC for the next theorem.'

/**
 * `/daily`: one procedurally generated puzzle per UTC day, the same for every player. It is a one-shot: the first
 * valid proof (of any length) uses up the day's attempt, which the server remembers and enforces. A proof that was
 * longer than the optimum unlocks a reveal of the exact shortest proof. Completing it extends the player's streak.
 */
export default function Daily({ store }: { store: GameStore }) {
  const [info, setInfo] = useState<DailyInfo | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    api<DailyInfo>('/api/daily')
      .then((r) => (r.ok ? setInfo(r.data) : setFailed(true)))
      .catch(() => setFailed(true))
  }, [])

  if (failed) {
    return <p className="panel mx-auto max-w-md p-5 font-bold">Couldn&apos;t reach the server for today&apos;s theorem. Is the backend awake? Try again in a moment.</p>
  }
  if (!info) return <p className="font-mono text-lg font-bold">fetching today&apos;s theorem…</p>
  return <DailyView info={info} store={store} />
}

/** The streak line in the banner. */
function streakNote(streak: Streak | null, done: boolean): string {
  if (!streak || streak.current === 0) return done ? '🔥 1-day streak' : 'No streak yet: solve today’s theorem to start one.'
  const days = `${streak.current}-day streak`
  if (done || streak.todayDone) return `🔥 ${days}${streak.longest > streak.current ? ` · best ${streak.longest}` : ' · your best yet'}`
  return `🔥 ${days} · solve today’s to make it ${streak.current + 1}`
}

function DailyView({ info, store }: { info: DailyInfo; store: GameStore }) {
  // stable identity: the Game restarts its level whenever this object changes
  const level = useMemo(() => customToLevel(decodeCustom(info.level)), [info.level])
  const [completion, setCompletion] = useState<Completion | null>(info.completion)
  const [streak, setStreak] = useState<Streak | null>(info.streak)
  const [stats, setStats] = useState<DailyStats | null>(null)
  const [showCalendar, setShowCalendar] = useState(!!info.completion)
  const [copy, setCopy] = useState<{ state: 'idle' | 'copied' | 'failed'; text: string }>({ state: 'idle', text: '' })
  const [reveal, setReveal] = useState<{ state: 'idle' | 'loading' | 'shown' | 'failed'; solution?: string; message?: string }>({ state: 'idle' })

  const loadStats = useCallback(() => {
    api<DailyStats>('/api/daily/stats')
      .then((r) => r.ok && setStats(r.data))
      .catch(() => {})
  }, [])
  useEffect(loadStats, [loadStats])

  const onSolved = (r: SolveInfo) => {
    setCompletion({ lines: r.lines, optimalLines: r.optimalLines, points: r.total, timeMs: r.elapsedMs, canRevealSolution: r.lines > r.optimalLines })
    if (r.streak) setStreak(r.streak)
    setShowCalendar(true)
    loadStats()
  }

  // the solved board is the target board
  const result = completion && level.targetState
    ? {
        number: info.number,
        lines: completion.lines,
        optimalLines: completion.optimalLines,
        rows: boardToEmoji(level.targetState),
        streak: streak?.current,
        timeMs: completion.timeMs,
      }
    : null

  const share = async () => {
    if (!result) return
    const text = shareText(result, `${window.location.origin}/daily`)
    try {
      await navigator.clipboard.writeText(text)
      setCopy({ state: 'copied', text })
    } catch {
      // clipboard blocked (insecure origin, permissions): show the text so it can be copied by hand
      setCopy({ state: 'failed', text })
    }
  }

  const showOptimal = async () => {
    setReveal({ state: 'loading' })
    const r = await api<{ solution?: string; error?: string }>('/api/daily/solution')
    if (r.ok && r.data.solution) setReveal({ state: 'shown', solution: r.data.solution })
    else setReveal({ state: 'failed', message: r.data.error ?? 'Could not load the optimal solution.' })
  }

  const card = result && shareLines(result)
  return (
    <div>
      <div className="panel panel-neon mb-8 -rotate-[0.5deg] p-5" data-testid="daily-banner">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">Daily Theorem #{info.number}</h2>
            <p className="mt-1 font-mono text-sm font-bold" data-testid="streak-note">{streakNote(streak, !!completion)}</p>
          </div>
          {completion ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="border-[3px] border-ink bg-aqua px-3 py-1 text-sm font-bold" data-testid="daily-done">
                ✓ Locked in: {completion.lines} line{completion.lines === 1 ? '' : 's'}
                {isOptimal(completion) ? ' · optimal!' : ` · optimal is ${completion.optimalLines}`}
              </span>
              <button data-testid="share" onClick={share} className="btn-ink px-4 py-2">
                Share
              </button>
              {completion.canRevealSolution && reveal.state !== 'shown' && (
                <button data-testid="show-optimal" onClick={showOptimal} disabled={reveal.state === 'loading'} className="btn-magenta px-4 py-2">
                  Show Optimal Solution
                </button>
              )}
            </div>
          ) : (
            <span className="border-[3px] border-ink bg-card px-3 py-1 text-sm font-bold text-ink" data-testid="daily-todo">Unsolved. One shot at a valid proof.</span>
          )}
        </div>

        {copy.state === 'copied' && (
          <p className="mt-3 inline-block border-[3px] border-ink bg-card px-2 py-1 text-sm font-bold text-ink" data-testid="share-status">Copied! Go flex on someone.</p>
        )}
        {copy.state === 'failed' && (
          <div className="mt-2" data-testid="share-status">
            <p className="text-sm font-bold">Your browser said no to the clipboard. Copy this by hand:</p>
            <textarea readOnly rows={9} value={copy.text} className="mt-1 w-full bg-abyss p-2 font-mono text-sm text-neon" onFocus={(e) => e.target.select()} />
          </div>
        )}
        {reveal.state === 'failed' && <p className="mt-3 border-[3px] border-ink bg-magenta px-2 py-1 text-sm font-bold text-white">{reveal.message}</p>}
        {reveal.state === 'shown' && completion && (
          <div className="mt-4" data-testid="optimal-solution">
            <p className="mb-1 text-sm font-extrabold uppercase">
              The optimal proof: {completion.optimalLines} lines (yours was {completion.lines})
            </p>
            <pre className="border-4 border-ink bg-abyss p-3 font-mono text-sm text-neon" data-testid="optimal-solution-code">{reveal.solution}</pre>
            <p className="mt-1 font-mono text-xs font-medium">The shortest single-block proof from the solver. A clever helper macro could be shorter still.</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <button
          className="btn-paper px-4 py-2 text-sm"
          data-testid="toggle-calendar"
          aria-expanded={showCalendar}
          onClick={() => setShowCalendar((s) => !s)}
        >
          {showCalendar ? '▾' : '▸'} Streak &amp; calendar
        </button>

        {showCalendar && (
          <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]" data-testid="streak-panel">
            {card ? (
              <div className="panel p-5" data-testid="share-card">
                <p className="mb-3 inline-block bg-abyss px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">Your share card</p>
                <p className="text-xl font-extrabold" data-testid="share-head">{card.head}</p>
                <p className="mt-1 text-xl leading-tight tracking-wide" data-testid="share-bar">{card.bar}</p>
                <p className="mt-1 font-mono text-sm font-bold" data-testid="share-detail">{card.detail}</p>
                <div className="mt-3 text-2xl leading-tight tracking-wide" data-testid="share-grid">
                  {card.rows.map((row, i) => (
                    <div key={i}>{row}</div>
                  ))}
                </div>
                <button data-testid="copy-card" onClick={share} className="btn-neon mt-4 px-4 py-2 text-sm">
                  Copy to clipboard
                </button>
              </div>
            ) : (
              <div className="panel p-5">
                <p className="text-lg font-extrabold uppercase">Your share card appears here</p>
                <p className="mt-1 text-sm font-medium">
                  Solve today’s theorem to get a Wordle-style card: one square per line of your proof, the solved board in emoji, and your streak.
                </p>
              </div>
            )}
            {stats ? <StreakCalendar stats={stats} /> : <p className="font-mono text-sm font-bold">loading your calendar…</p>}
          </div>
        )}
      </div>

      <Game store={store} fixedLevel={level} onSolved={onSolved} locked={completion ? LOCKED : undefined} />
    </div>
  )
}
