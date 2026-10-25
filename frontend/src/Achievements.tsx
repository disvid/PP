import { useEffect, useState } from 'react'
import { TIER_STYLE } from './AchievementToasts'
import { api } from './api'
import { ACHIEVEMENTS } from './data/achievements'
import type { ProgressKind } from './data/achievements'
import type { Streak } from './types'

interface Report {
  /** badge key -> when it was unlocked (ms since the epoch) */
  unlocked: Record<string, number>
  progress: Record<ProgressKind, number>
  streak: Streak
}

const when = (ms: number) => new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

/** `/achievements`: every badge, locked or earned, with progress toward the count-based ones. */
export default function Achievements() {
  const [report, setReport] = useState<Report | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    api<Report>('/api/achievements')
      .then((r) => (r.ok ? setReport(r.data) : setFailed(true)))
      .catch(() => setFailed(true))
  }, [])

  if (failed) return <p className="panel mx-auto max-w-md p-5 font-bold">Couldn&apos;t load your badges. Is the backend awake?</p>
  if (!report) return <p className="font-mono text-lg font-bold">polishing the trophy shelf…</p>

  const earned = ACHIEVEMENTS.filter((a) => report.unlocked[a.key]).length
  return (
    <section className="panel-heavy w-full p-6" data-testid="achievements-view">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="inline-block border-4 border-ink bg-abyss px-3 py-1 text-3xl font-extrabold uppercase tracking-tight text-neon">Achievements</h2>
        <p className="font-mono text-sm font-bold" data-testid="achievement-count">
          {earned} / {ACHIEVEMENTS.length} unlocked
        </p>
      </div>
      <div className="mt-3 h-4 border-[3px] border-ink bg-card">
        <div className="h-full bg-neon transition-[width] duration-500" style={{ width: `${(earned / ACHIEVEMENTS.length) * 100}%` }} />
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const at = report.unlocked[a.key]
          const have = a.progress ? Math.min(report.progress[a.progress.of], a.progress.goal) : 0
          return (
            <li
              key={a.key}
              data-testid="achievement"
              data-key={a.key}
              data-unlocked={at ? 'true' : 'false'}
              className={`flex gap-3 border-4 border-ink bg-card p-3 ${at ? 'shadow-[5px_5px_0_var(--shade)]' : 'opacity-60'}`}
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center border-4 border-ink text-3xl ${at ? TIER_STYLE[a.tier] : 'bg-paper grayscale'}`}
                aria-hidden="true"
              >
                {at ? a.icon : '🔒'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-extrabold uppercase leading-tight">{a.title}</span>
                  <span className="font-mono text-[0.6rem] font-bold uppercase tracking-widest">{a.tier}</span>
                </span>
                <span className="block text-sm font-medium leading-snug">{a.description}</span>
                {at ? (
                  <span className="mt-1 block font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">Unlocked {when(at)}</span>
                ) : (
                  a.progress && (
                    <span className="mt-2 block" data-testid="achievement-progress">
                      <span className="block h-2.5 border-2 border-ink bg-paper">
                        <span className="block h-full bg-magenta" style={{ width: `${(have / a.progress.goal) * 100}%` }} />
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {have} / {a.progress.goal}
                      </span>
                    </span>
                  )
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
