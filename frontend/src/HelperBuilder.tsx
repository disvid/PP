import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { COLORS } from './data/levels'
import { MAX_COMMANDS, PARAMS, PRESETS, SLOTS, blankRow, buildHelper } from './data/helper'
import type { Op } from './data/helper'
import type { Row } from './data/helper'

const field = 'btn-paper px-2 py-1 text-sm'

interface Props {
  open: boolean
  onClose: () => void
  /** `top` puts the definition above the proof (helpers must be defined before they are called); `end` appends a call */
  onInsert: (text: string, where: 'top' | 'end') => void
}

function Builder({ onClose, onInsert }: Omit<Props, 'open'>) {
  const [name, setName] = useState(PRESETS[0].name)
  const [rows, setRows] = useState<Row[]>(PRESETS[0].rows)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const built = useMemo(() => buildHelper(name, rows), [name, rows])
  const valueOf = (p: { name: string; kind: string }) => values[p.name] ?? (p.kind === 'color' ? 'red' : '0')
  const call = `${name}(${built.params.map((p) => valueOf(p)).join(', ')})`

  const setArg = (ri: number, ai: number, v: string) =>
    setRows((rs) => rs.map((r, i) => (i === ri ? { ...r, args: r.args.map((a, k) => (k === ai ? v : a)) } : r)))

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-abyss/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-testid="helper-builder"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Helper builder"
        className="panel-heavy flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden"
        initial={{ y: 24, rotate: -1 }}
        animate={{ y: 0, rotate: 0 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-4 border-ink bg-abyss px-6 py-4 text-bone">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neon">helper builder</p>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">Make a helper</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn-magenta px-3 py-1 text-sm" data-testid="helper-close">
            ✕
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5 text-sm">
          <p>
            A helper is one <code className="border-2 border-ink bg-neon px-1 font-mono text-[#0a0a0a]">def</code> line holding up to {MAX_COMMANDS} commands. Build it here, add it to your proof, then call it like a command. Every
            call costs one line, so a helper pays off when you use it more than once.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase">Start from</span>
            {PRESETS.map((p) => (
              <button
                key={p.title}
                className="btn-paper px-2 py-1 text-xs"
                onClick={() => {
                  setName(p.name)
                  setRows(p.rows)
                  setValues({})
                }}
              >
                {p.title}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 font-semibold">
            Name
            <input className={`${field} w-40 font-mono`} value={name} maxLength={20} onChange={(e) => setName(e.target.value.trim())} data-testid="helper-name" aria-label="Helper name" />
          </label>

          <div className="space-y-2" data-testid="helper-rows">
            <p className="font-mono text-xs font-bold uppercase">Commands (coordinates are parameters a–f)</p>
            {rows.map((r, ri) => (
              <div key={ri} className="flex flex-wrap items-center gap-2" data-testid="helper-row">
                <select
                  className={field}
                  value={r.op}
                  aria-label={`Command ${ri + 1}`}
                  onChange={(e) => setRows((rs) => rs.map((x, i) => (i === ri ? blankRow(e.target.value as Op) : x)))}
                >
                  {(['swap', 'paint', 'rotate'] as Op[]).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <span className="font-mono">(</span>
                {SLOTS[r.op].map((slot, ai) => (
                  <select key={ai} className={field} value={r.args[ai]} aria-label={slot.label} title={slot.label} onChange={(e) => setArg(ri, ai, e.target.value)}>
                    {slot.color && <optgroup label="Colors">{COLORS.map((c) => <option key={c}>{c}</option>)}</optgroup>}
                    <optgroup label="Parameters">{PARAMS.map((p) => <option key={p}>{p}</option>)}</optgroup>
                  </select>
                ))}
                <span className="font-mono">)</span>
                <button className="btn-paper px-2 py-1 text-xs" aria-label={`Remove command ${ri + 1}`} onClick={() => setRows((rs) => rs.filter((_, i) => i !== ri))}>
                  ✕
                </button>
              </div>
            ))}
            {rows.length < MAX_COMMANDS && (
              <div className="flex gap-2">
                {(['paint', 'swap', 'rotate'] as Op[]).map((o) => (
                  <button key={o} className="btn-bare text-xs" onClick={() => setRows((rs) => [...rs, blankRow(o)])}>
                    + {o}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mb-1 font-mono text-xs font-bold uppercase">Your helper</p>
            <pre className="overflow-x-auto border-4 border-ink bg-abyss p-3 font-mono text-sm text-neon" data-testid="helper-def">{built.def}</pre>
            {built.problem && (
              <p className="mt-2 border-[3px] border-ink bg-magenta px-2 py-1 font-bold text-white" data-testid="helper-problem">
                {built.problem}
              </p>
            )}
          </div>

          {!built.problem && (
            <div>
              <p className="mb-1 font-mono text-xs font-bold uppercase">Call it with</p>
              <div className="flex flex-wrap items-center gap-2">
                {built.params.map((p) =>
                  p.kind === 'color' ? (
                    <select key={p.name} className={field} value={valueOf(p)} aria-label={`Value of ${p.name}`} onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}>
                      {COLORS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <label key={p.name} className="flex items-center gap-1 font-mono text-xs font-bold">
                      {p.name}
                      <input
                        className={`${field} w-14`}
                        type="number"
                        min={0}
                        max={4}
                        value={valueOf(p)}
                        aria-label={`Value of ${p.name}`}
                        onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
                      />
                    </label>
                  ),
                )}
              </div>
              <pre className="mt-2 overflow-x-auto border-[3px] border-ink bg-card p-2 font-mono text-sm" data-testid="helper-call">{call}</pre>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t-4 border-ink bg-paper px-6 py-4">
          <button
            className="btn-neon px-4 py-2 text-sm"
            disabled={!!built.problem}
            data-testid="helper-insert-def"
            onClick={() => {
              onInsert(built.def, 'top')
              onClose()
            }}
          >
            Add helper to my proof
          </button>
          <button className="btn-aqua px-4 py-2 text-sm" disabled={!!built.problem} data-testid="helper-insert-call" onClick={() => onInsert(call, 'end')}>
            Add this call
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** The helper builder dialog, in a portal so no styled ancestor can trap its fixed overlay. */
export default function HelperBuilder({ open, onClose, onInsert }: Props) {
  return createPortal(<AnimatePresence>{open && <Builder onClose={onClose} onInsert={onInsert} />}</AnimatePresence>, document.body)
}
