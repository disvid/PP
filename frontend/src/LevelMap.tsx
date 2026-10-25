import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { api } from './api'
import { LEVELS, levelKey } from './data/levels'

interface Best { id: number; lines: number; hints: number; points: number }

interface Props {
  open: boolean
  onClose: () => void
  /** index into LEVELS of the level being played (>= LEVELS.length for a custom level) */
  current: number
  /** levels solved during this visit, by level key (the server's records cover earlier visits) */
  solvedNow: Set<string>
  onPick: (index: number) => void
}

function Map({ onClose, current, solvedNow, onPick }: Omit<Props, 'open'>) {
  const [best, setBest] = useState<Record<number, Best> | null>(null)

  useEffect(() => {
    api<{ levels: Best[] }>('/api/progress')
      .then((r) => setBest(r.ok ? Object.fromEntries(r.data.levels.map((b) => [b.id, b])) : {}))
      .catch(() => setBest({}))
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const stateOf = (i: number): 'optimal' | 'solved' | 'open' => {
    const l = LEVELS[i]
    const b = best?.[l.id]
    if (b) return b.lines <= l.optimalLines ? 'optimal' : 'solved'
    return solvedNow.has(levelKey(l)) ? 'solved' : 'open'
  }
  const states = LEVELS.map((_, i) => stateOf(i))
  const solved = states.filter((s) => s !== 'open').length
  const optimal = states.filter((s) => s === 'optimal').length

  const firstGenerated = LEVELS.findIndex((l) => l.id > 23)
  const groups = [
    { title: 'Handcrafted', hint: 'levels 1 to 23', from: 0, to: firstGenerated },
    { title: 'Generated', hint: 'fresh scrambles, rising difficulty', from: firstGenerated, to: LEVELS.length },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-abyss/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-testid="level-map"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Level map"
        className="panel-heavy flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden"
        initial={{ y: 24, rotate: 1 }}
        animate={{ y: 0, rotate: 0 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-4 border-ink bg-abyss px-6 py-4 text-bone">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neon" data-testid="map-summary">
              {best ? `${solved} / ${LEVELS.length} solved · ${optimal} optimal` : 'loading your progress…'}
            </p>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">Level map</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn-magenta px-3 py-1 text-sm" data-testid="map-close">
            ✕
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="mb-2 font-extrabold uppercase">
                {g.title} <span className="font-mono text-xs font-medium normal-case">{g.hint}</span>
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(3.6rem,1fr))] gap-2">
                {LEVELS.slice(g.from, g.to).map((l, k) => {
                  const i = g.from + k
                  const s = states[i]
                  const look = s === 'optimal' ? 'btn-neon' : s === 'solved' ? 'btn-aqua' : 'btn-paper'
                  return (
                    <button
                      key={l.id}
                      data-testid="map-tile"
                      data-level={l.id}
                      data-state={s}
                      title={`${l.id}. ${l.title} · ${l.gridSize}×${l.gridSize}, max ${l.parLimit} lines${s === 'optimal' ? ' · optimal ★' : s === 'solved' ? ' · solved' : ''}`}
                      onClick={() => {
                        onPick(i)
                        onClose()
                      }}
                      className={`btn btn-tile ${look} ${
                        i === current ? 'outline outline-[3px] outline-offset-2 outline-magenta' : ''
                      }`}
                    >
                      <span className="text-base">{l.id}</span>
                      <span className="mt-0.5 text-[0.6rem]">{s === 'optimal' ? '★' : s === 'solved' ? '✓' : `${l.gridSize}×${l.gridSize}`}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.7rem] font-medium">
            <span><span className="mr-1 inline-block h-3 w-3 border-2 border-ink bg-neon align-middle" />optimal ★</span>
            <span><span className="mr-1 inline-block h-3 w-3 border-2 border-ink bg-aqua align-middle" />solved ✓</span>
            <span><span className="mr-1 inline-block h-3 w-3 border-2 border-magenta bg-card align-middle" />you are here</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** A grid of every built-in level with the player's progress. Picking a tile jumps to that level. */
export default function LevelMap({ open, ...rest }: Props) {
  return createPortal(<AnimatePresence>{open && <Map {...rest} />}</AnimatePresence>, document.body)
}
