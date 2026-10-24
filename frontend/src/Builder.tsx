import { useState } from 'react'
import BoardView from './BoardView'
import { api } from './api'
import { COLORS, boardToRows, theoremText } from './data/levels'
import type { Block, Board, Color, Constraint } from './data/levels'

const DIRS: (0 | 1 | 2 | 3 | undefined)[] = [undefined, 0, 1, 2, 3]

const blank = (n: number): Board => Array.from({ length: n }, () => Array.from({ length: n }, () => ({ color: 'blue' }) as Block))

interface Props {
  /** called with the base64url payload once the server has saved the level */
  onPlay: (payload: string) => void
}

export default function Builder({ onPlay }: Props) {
  const [size, setSize] = useState<3 | 4>(3)
  const [title, setTitle] = useState('My level')
  const [par, setPar] = useState(3)
  const [optimal, setOptimal] = useState(3)
  const [mode, setMode] = useState<'board' | 'property'>('board')
  const [initial, setInitial] = useState<Board>(blank(3))
  const [target, setTarget] = useState<Board>(blank(3))
  const [constraints, setConstraints] = useState<Constraint[]>([{ kind: 'count', color: 'red', n: 2 }])
  const [result, setResult] = useState<{ url: string; payload: string } | null>(null)
  const [error, setError] = useState('')

  const resize = (n: 3 | 4) => {
    setSize(n)
    setInitial(blank(n))
    setTarget(blank(n))
  }

  // click: next color; shift-click: next arrow direction (none, up, right, down, left)
  const edit = (set: (f: (b: Board) => Board) => void) => (x: number, y: number, e: React.MouseEvent) =>
    set((b) =>
      b.map((row, ry) =>
        row.map((blk, rx) => {
          if (rx !== x || ry !== y) return blk
          if (e.shiftKey) {
            const next = DIRS[(DIRS.indexOf(blk.rot) + 1) % DIRS.length]
            return next === undefined ? { color: blk.color } : { color: blk.color, rot: next }
          }
          const color = COLORS[(COLORS.indexOf(blk.color) + 1) % COLORS.length]
          return blk.rot === undefined ? { color } : { color, rot: blk.rot }
        }),
      ),
    )

  const updateConstraint = (i: number, c: Constraint) => setConstraints((cs) => cs.map((o, k) => (k === i ? c : o)))

  const create = async () => {
    setError('')
    setResult(null)
    const body = {
      title,
      size,
      par,
      optimal: Math.min(optimal, par),
      initial: boardToRows(initial),
      ...(mode === 'board' ? { target: boardToRows(target) } : { property: { constraints } }),
    }
    const r = await api<{ url: string; level: string; error?: string }>('/api/custom-levels', body)
    if (!r.ok) return setError(r.data.error ?? 'Could not save the level')
    setResult({ url: r.data.url, payload: r.data.level })
  }

  const field = ' btn-paper px-2 py-1 text-sm'
  return (
    <section className="panel-heavy mx-auto max-w-4xl rotate-[0.3deg] p-6" data-testid="builder">
      <h2 className="mb-2 inline-block -rotate-1 border-4 border-ink bg-ink px-3 py-1 text-2xl font-extrabold uppercase tracking-tight text-neon">Level Builder</h2>
      <p className="mb-4 font-mono text-xs font-medium">Click a block to change its color, shift-click to add or turn an arrow.</p>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <input className={field} value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} aria-label="Title" />
        <label>
          Grid{' '}
          <select className={field} value={size} onChange={(e) => resize(Number(e.target.value) as 3 | 4)}>
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
          </select>
        </label>
        <label>
          Par (max lines){' '}
          <input className={`${field} w-16`} type="number" min={1} max={30} value={par} onChange={(e) => setPar(Number(e.target.value))} />
        </label>
        <label title="Your best known solution length. Players are scored against it.">
          Optimal lines{' '}
          <input className={`${field} w-16`} type="number" min={1} max={par} value={optimal} onChange={(e) => setOptimal(Number(e.target.value))} />
        </label>
        <label>
          Target{' '}
          <select className={field} value={mode} onChange={(e) => setMode(e.target.value as 'board' | 'property')}>
            <option value="board">match a board</option>
            <option value="property">satisfy a theorem</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <div>
          <p className="mb-2 font-mono text-xs font-bold uppercase">Initial</p>
          <BoardView board={initial} size="sm" testPrefix="bi" onCellClick={edit(setInitial)} />
        </div>
        {mode === 'board' ? (
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase">Target</p>
            <BoardView board={target} size="sm" testPrefix="bt" onCellClick={edit(setTarget)} />
          </div>
        ) : (
          <div className="min-w-64 text-sm">
            <p className="mb-2 font-mono text-xs font-bold uppercase">Constraints (all must hold)</p>
            {constraints.map((c, i) => (
              <div key={i} className="mb-1 flex items-center gap-2">
                <select
                  className={field}
                  value={c.kind}
                  onChange={(e) => {
                    const kind = e.target.value as Constraint['kind']
                    updateConstraint(
                      i,
                      kind === 'noAdjacent' ? { kind, color: 'red' } : kind === 'count' ? { kind, color: 'red', n: 2 } : { kind },
                    )
                  }}
                >
                  <option value="count">exactly n of a color</option>
                  <option value="noAdjacent">no touching blocks of a color</option>
                  <option value="rowsUniform">every row one color</option>
                  <option value="symmetricH">left-right mirror</option>
                </select>
                {(c.kind === 'count' || c.kind === 'noAdjacent') && (
                  <select className={field} value={c.color} onChange={(e) => updateConstraint(i, { ...c, color: e.target.value as Color })}>
                    {COLORS.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                )}
                {c.kind === 'count' && (
                  <input
                    className={`${field} w-14`}
                    type="number"
                    min={0}
                    max={16}
                    value={c.n}
                    onChange={(e) => updateConstraint(i, { ...c, n: Number(e.target.value) })}
                  />
                )}
                <button className="btn-paper px-2 text-xs" onClick={() => setConstraints((cs) => cs.filter((_, k) => k !== i))} aria-label="Remove">
                  ✕
                </button>
              </div>
            ))}
            {constraints.length < 4 && (
              <button className="btn-bare text-xs" onClick={() => setConstraints((cs) => [...cs, { kind: 'rowsUniform' }])}>
                + add constraint
              </button>
            )}
            {constraints.length > 0 && <pre className="mt-2 whitespace-pre-wrap border-[3px] border-ink bg-ink p-2 text-xs text-neon">{theoremText({ constraints })}</pre>}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button data-testid="builder-create" className="btn-neon px-4 py-2 text-sm" onClick={create}>
          Forge a share link
        </button>
        {error && <span className="border-[3px] border-ink bg-magenta px-2 py-1 text-sm font-bold text-white">{error}</span>}
      </div>
      {result && (
        <div className="mt-3 text-sm" data-testid="builder-result">
          <input readOnly className={`${field} w-full`} value={result.url} onFocus={(e) => e.target.select()} />
          <button className="btn-aqua mt-3 px-3 py-1" onClick={() => onPlay(result.payload)}>
            Play it
          </button>
        </div>
      )}
    </section>
  )
}
