import { useEffect, useMemo, useState } from 'react'
import Game from './Game'
import type { GameStore, SolveInfo } from './Game'
import { api } from './api'
import { customToLevel, decodeCustom } from './data/levels'
import { boardToEmoji, isOptimal, loadDaily, saveDaily, shareText } from './dailyUtils'
import type { DailyRecord } from './dailyUtils'

interface DailyInfo {
  date: string
  number: number
  /** the generated puzzle as a base64url custom-level payload */
  level: string
}

/**
 * `/daily`: one procedurally generated puzzle per UTC day. The server seeds the generator with the date, so every
 * player gets the exact same puzzle. Completion lives in localStorage.
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

function DailyView({ info, store }: { info: DailyInfo; store: GameStore }) {
  // stable identity: the Game restarts its level whenever this object changes
  const level = useMemo(() => customToLevel(decodeCustom(info.level)), [info.level])
  const [record, setRecord] = useState<DailyRecord | null>(() => loadDaily(info.date))
  const [copy, setCopy] = useState<{ state: 'idle' | 'copied' | 'failed'; text: string }>({ state: 'idle', text: '' })

  const onSolved = (r: SolveInfo) =>
    setRecord(
      saveDaily({
        date: info.date,
        number: info.number,
        levelId: 0,
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
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">Daily Theorem #{info.number}</h2>
            <p className="font-mono text-xs font-bold">{info.date} (UTC) · generated fresh from today&apos;s date, identical for everyone</p>
          </div>
          {record ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="border-[3px] border-ink bg-aqua px-3 py-1 text-sm font-bold" data-testid="daily-done">
                ✓ Solved in {record.lines} line{record.lines === 1 ? '' : 's'}
                {isOptimal(record) ? ' · optimal!' : ` · best known: ${record.optimalLines}`}
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
            <textarea readOnly rows={7} value={copy.text} className="mt-1 w-full bg-ink p-2 font-mono text-sm text-neon" onFocus={(e) => e.target.select()} />
          </div>
        )}
      </div>

      <Game store={store} fixedLevel={level} onSolved={onSolved} />
    </div>
  )
}
