import { useMemo, useState } from 'react'
import Game from './Game'
import type { GameStore, SolveInfo } from './Game'
import { boardToEmoji, dailyLevel, dailyNumber, dateKey, isOptimal, loadDaily, saveDaily, shareText } from './dailyUtils'
import type { DailyRecord } from './dailyUtils'

/** `/daily`: one puzzle per UTC day, the same for everyone. Completion lives in localStorage. */
export default function Daily({ store }: { store: GameStore }) {
  const today = useMemo(() => {
    const now = new Date()
    const date = dateKey(now)
    return { date, number: dailyNumber(now), level: dailyLevel(date) }
  }, [])
  const [record, setRecord] = useState<DailyRecord | null>(() => loadDaily(today.date))
  const [copy, setCopy] = useState<{ state: 'idle' | 'copied' | 'failed'; text: string }>({ state: 'idle', text: '' })

  const onSolved = (r: SolveInfo) =>
    setRecord(
      saveDaily({
        date: today.date,
        number: today.number,
        levelId: today.level.id,
        lines: r.lines,
        optimalLines: r.optimalLines,
        elapsedMs: r.elapsedMs,
        total: r.total,
        rows: boardToEmoji(r.board),
      }),
    )

  const share = async () => {
    if (!record) return
    const text = shareText(record, `${window.location.origin}/daily`)
    try {
      await navigator.clipboard.writeText(text)
      setCopy({ state: 'copied', text })
    } catch {
      // clipboard blocked (insecure origin, permissions): show the text so it can be copied by hand
      setCopy({ state: 'failed', text })
    }
  }

  return (
    <div>
      <div className="panel panel-neon mb-8 -rotate-[0.5deg] p-5" data-testid="daily-banner">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">Daily Theorem #{today.number}</h2>
            <p className="font-mono text-xs font-bold">{today.date} (UTC) · same puzzle for the whole planet</p>
          </div>
          {record ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="border-[3px] border-ink bg-aqua px-3 py-1 text-sm font-bold" data-testid="daily-done">
                ✓ Solved in {record.lines} line{record.lines === 1 ? '' : 's'}
                {isOptimal(record) ? ' · optimal!' : ` · optimal is ${record.optimalLines}`}
              </span>
              <button data-testid="share" onClick={share} className="btn-ink px-4 py-2">
                Share
              </button>
            </div>
          ) : (
            <span className="border-[3px] border-ink bg-card px-3 py-1 text-sm font-bold" data-testid="daily-todo">Unsolved. The theorem is waiting.</span>
          )}
        </div>
        {copy.state === 'copied' && (
          <p className="mt-3 inline-block border-[3px] border-ink bg-card px-2 py-1 text-sm font-bold" data-testid="share-status">Copied! Go flex on someone.</p>
        )}
        {copy.state === 'failed' && (
          <div className="mt-2" data-testid="share-status">
            <p className="text-sm font-bold">Your browser said no to the clipboard. Copy this by hand:</p>
            <textarea readOnly rows={5} value={copy.text} className="mt-1 w-full bg-ink p-2 font-mono text-sm text-neon" onFocus={(e) => e.target.select()} />
          </div>
        )}
      </div>

      <Game store={store} fixedLevel={today.level} onSolved={onSolved} />
    </div>
  )
}
