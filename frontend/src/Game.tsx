import { useEffect, useMemo, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useSearchParams } from 'react-router-dom'
import BoardView from './BoardView'
import type { Flash } from './BoardView'
import HelperBuilder from './HelperBuilder'
import LevelMap from './LevelMap'
import ProofEditor from './ProofEditor'
import { api } from './api'
import { LEVELS, customToLevel, decodeCustom, levelKey, theoremText, violations } from './data/levels'
import type { Block, Board, Color, Level } from './data/levels'
import { countLines } from './data/scoring'
import { announceAchievements } from './achievementBus'
import { celebrate } from './effects'
import { isMuted, playOp, setMuted, unlockAudio } from './soundUtils'
import type { SoundOp } from './soundUtils'
import type { EvalError, EvalResponse, Streak } from './types'

const STEP_MS = 700
const FLASH_MS = 3000

const clone = (b: Board): Board => b.map((r) => r.map((c) => ({ ...c })))
const starter = (id: number | string) => `-- Level ${id}: write your proof here\n`
const pad = (n: number) => String(n).padStart(2, '0')
const fmt = (ms: number) => `${pad(Math.floor(ms / 60000))}:${pad(Math.floor(ms / 1000) % 60)}`

/**
 * A stable id for every block at every step. Swaps move ids around, paints and rotations do not, so the board can
 * animate a swapped block gliding to its new cell instead of redrawing it.
 */
export function buildIds(initial: Board, ops: (SoundOp | null)[]): number[][][] {
  const w = initial[0].length
  let cur = initial.map((row, y) => row.map((_, x) => y * w + x))
  const out = [cur]
  for (const op of ops) {
    if (op?.name === 'swap') {
      const [x1, y1, x2, y2] = op.args.map(Number)
      const next = cur.map((r) => [...r])
      next[y1][x1] = cur[y2][x2]
      next[y2][x2] = cur[y1][x1]
      cur = next
    }
    out.push(cur)
  }
  return out
}

interface Ghost { line: number; before: Board; changed: { x: number; y: number; after: Block }[] }
interface HintReply {
  hint: { kind: 'swap' | 'paint' | 'rotate'; cells: [number, number][]; color?: Color } | null
  message?: string
  hints?: number
  error?: { message: string }
}
interface Clock { elapsedMs: number; hints: number }

/**
 * What survives leaving the Game route. The Game component is unmounted on /builder and /leaderboard,
 * so the player's code, solved levels and selected level live above it (in App).
 */
export interface GameStore {
  levelIdx: number
  setLevelIdx: (i: number) => void
  customLevel: Level | null
  setCustomLevel: (l: Level | null) => void
  codes: Record<string, string>
  setCodes: Dispatch<SetStateAction<Record<string, string>>>
  solved: Set<string>
  setSolved: Dispatch<SetStateAction<Set<string>>>
}

/** Lets the app pause the running level before it signs the player out. */
export const gameControl: { pause: (() => Promise<void>) | null } = { pause: null }

/** What a finished level reports to its page (the Daily page uses it for the share text). */
export interface SolveInfo {
  board: Board
  lines: number
  optimalLines: number
  elapsedMs: number | null
  total: number | null
  /** daily only: the streak including this solve */
  streak: Streak | null
}

interface Props {
  store: GameStore
  /** play exactly this level (the Daily Theorem): no level picker, no Next Level */
  fixedLevel?: Level
  onSolved?: (info: SolveInfo) => void
  /** why this level can no longer be played (a daily that was already completed); shown instead of the Start button */
  locked?: string
}

export default function Game({ store, fixedLevel, onSolved, locked }: Props) {
  const { customLevel, codes, solved, setCustomLevel, setLevelIdx, setCodes, setSolved } = store
  const [searchParams, setSearchParams] = useSearchParams()
  const levels = useMemo(
    () => (fixedLevel ? [fixedLevel] : customLevel ? [...LEVELS, customLevel] : LEVELS),
    [fixedLevel, customLevel],
  )
  const levelIdx = fixedLevel ? 0 : store.levelIdx
  const level = levels[levelIdx]
  const key = levelKey(level)

  // time travel: boards[0] is the initial board, boards[i] the board after step i
  const [boards, setBoards] = useState<Board[]>(() => [clone(level.initialState)])
  const [stepLines, setStepLines] = useState<number[]>([])
  const [stepOps, setStepOps] = useState<(SoundOp | null)[]>([])
  const [viewIdx, setViewIdx] = useState(0)
  const [muted, setMutedState] = useState(isMuted)
  const [shake, setShake] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<EvalError | null>(null)
  const [status, setStatus] = useState<{ text: string; kind: 'info' | 'ok' | 'bad' }>({ text: '', kind: 'info' })
  const [running, setRunning] = useState(false)
  const [engine, setEngine] = useState('')
  const [won, setWon] = useState(false)
  const [score, setScore] = useState<EvalResponse['score']>(null)
  const [ghost, setGhost] = useState<Ghost | null>(null)
  const [flash, setFlash] = useState<Flash | null>(null)
  const [helperOpen, setHelperOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [insert, setInsert] = useState<{ id: number; text: string; where: 'top' | 'end' } | null>(null)

  // A level is locked until "Start Level" is clicked. The clock counts up only while `since` is set.
  const [started, setStarted] = useState(false)
  const [clock, setClock] = useState<{ base: number; since: number | null }>({ base: 0, since: null })
  const [now, setNow] = useState(() => Date.now())
  const [hints, setHints] = useState(0)

  const timers = useRef<number[]>([])
  const finishRef = useRef<(() => void) | null>(null)
  const flashTimer = useRef<number | null>(null)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  // Sonification: whichever way the step index moves (auto playback, replay or the scrubber), play that step's sound.
  const opsRef = useRef(stepOps)
  opsRef.current = stepOps
  const prevView = useRef(0)
  useEffect(() => {
    if (viewIdx > 0 && viewIdx !== prevView.current) {
      const op = opsRef.current[viewIdx - 1]
      if (op) playOp(op)
    }
    prevView.current = viewIdx
  }, [viewIdx])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  const code = codes[key] ?? starter(level.id || 'custom')
  const levelRef = (l: Level) => (l.custom ? { custom: l.custom } : { levelId: l.id })
  const elapsed = clock.base + (clock.since ? now - clock.since : 0)

  // latest values for callbacks that outlive a render
  const live = useRef({ started, won, level })
  live.current = { started, won, level }

  // ---- clock: start / pause / resume -------------------------------------------------
  const freezeClock = () => setClock((c) => ({ base: c.base + (c.since ? Date.now() - c.since : 0), since: null }))

  const pauseLevel = async (l: Level) => {
    freezeClock()
    await api('/api/sessions/pause', levelRef(l))
  }

  /** Starts the server-side clock (or resumes it where it was paused). */
  const startClock = async (l: Level): Promise<boolean> => {
    const r = await api<Clock>('/api/sessions/start', levelRef(l))
    if (!r.ok) return false
    setClock({ base: r.data.elapsedMs, since: Date.now() })
    setHints(r.data.hints)
    return true
  }

  const startLevel = async () => {
    if (locked) return
    if (await startClock(level)) {
      setStarted(true)
      setStatus({ text: '', kind: 'info' })
    } else {
      setStatus({ text: 'Could not start the level (is the backend running, and are you still signed in?)', kind: 'bad' })
    }
  }

  // The game is unmounted on other routes: pause the level's clock on the way out, and let the app
  // pause it before signing out (the token is gone by the time an unmount cleanup would run).
  useEffect(() => {
    gameControl.pause = async () => {
      const { started: s, won: w, level: l } = live.current
      if (s && !w) await pauseLevel(l)
    }
    return () => {
      const { started: s, won: w, level: l } = live.current
      if (s && !w) void api('/api/sessions/pause', levelRef(l))
      gameControl.pause = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- level loading -----------------------------------------------------------------
  const resetBoard = (l: Level) => {
    clearTimers()
    finishRef.current = null
    setRunning(false)
    setError(null)
    setWon(false)
    setScore(null)
    setGhost(null)
    setFlash(null)
    setStepLines([])
    setStepOps([])
    setViewIdx(0)
    setBoards([clone(l.initialState)])
    setStatus({ text: '', kind: 'info' })
  }

  const loadLevel = (idx: number, lv: Level) => {
    if (!fixedLevel) setLevelIdx(idx)
    resetBoard(lv)
    // every level load starts locked; elapsed time is restored from the server when it is started again
    setStarted(false)
    setClock({ base: 0, since: null })
    setHints(0)
    if (!fixedLevel) setSearchParams(lv.custom ? { level: lv.custom } : {}, { replace: true })
  }

  const selectLevel = (idx: number) => {
    if (started && !won) void pauseLevel(level) // keep the time spent on the level we are leaving
    loadLevel(idx, levels[idx])
  }

  const playCustom = (payload: string) => {
    try {
      const lv = customToLevel(decodeCustom(payload))
      if (started && !won) void pauseLevel(level)
      setCustomLevel(lv)
      loadLevel(LEVELS.length, lv)
    } catch (e) {
      setStatus({ text: e instanceof Error ? e.message : 'Invalid level link', kind: 'bad' })
    }
  }

  // a shared link (/game?level=...) loads that custom level once
  useEffect(() => {
    const p = searchParams.get('level')
    if (!fixedLevel && p && p !== customLevel?.custom) playCustom(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- running a proof ---------------------------------------------------------------
  const finalize = (res: EvalResponse) => {
    clearTimers()
    finishRef.current = null
    setViewIdx(res.steps.length)
    setRunning(false)
    if (res.error) {
      setError(res.error)
      setStatus({ text: `Line ${res.error.line}: ${res.error.message}`, kind: 'bad' })
      // an error that names a block shakes that block (see BoardView); one that does not shakes the whole board
      if (res.error.cells.length === 0) {
        setShake(true)
        window.setTimeout(() => setShake(false), 700)
      }
      return
    }
    setStatus({ text: res.message, kind: res.solved ? 'ok' : 'info' })
    if (res.solved) {
      setWon(true)
      setScore(res.score)
      setClock({ base: res.score?.elapsedMs ?? elapsed, since: null }) // the timer stops on success
      setSolved((s) => new Set(s).add(key))
      if (res.linesUsed <= level.optimalLines) celebrate(boardRef.current) // a perfect, optimal-length proof
      onSolved?.({
        board: res.steps.length ? res.steps[res.steps.length - 1].board : level.initialState,
        lines: res.linesUsed,
        optimalLines: level.optimalLines,
        elapsedMs: res.score?.elapsedMs ?? null,
        total: res.score?.total ?? null,
        streak: res.streak ?? null,
      })
      announceAchievements(res.achievements)
    }
  }

  const run = async () => {
    if (running || !started) return
    unlockAudio() // browsers only allow sound after a click, so open the audio context here
    resetBoard(level)
    setRunning(true)
    setStatus({ text: 'Crunching your proof…', kind: 'info' })
    let res: EvalResponse
    try {
      res = (await api<EvalResponse>('/api/evaluate', { ...levelRef(level), code })).data
      if (res.locked) {
        // the server refused the run: today's daily was already completed (maybe from another device)
        setRunning(false)
        setStatus({ text: res.message, kind: 'bad' })
        return
      }
      if (!res.steps) throw new Error('bad response')
    } catch {
      setRunning(false)
      setStatus({ text: 'Backend request failed (is the server running?)', kind: 'bad' })
      return
    }
    setEngine(res.engine)
    setBoards([clone(level.initialState), ...res.steps.map((s) => s.board)])
    setStepLines(res.steps.map((s) => s.line))
    setStepOps(res.steps.map((s) => s.op ?? null))
    setStatus({ text: 'Watching it unfold…', kind: 'info' })
    finishRef.current = () => finalize(res)
    res.steps.forEach((_, i) => timers.current.push(window.setTimeout(() => setViewIdx(i + 1), (i + 1) * STEP_MS)))
    timers.current.push(window.setTimeout(() => finalize(res), (res.steps.length + 1) * STEP_MS))
  }

  /** Plays the finished proof again from the initial board, one step at a time (with sound). */
  const replay = () => {
    if (running || boards.length < 2) return
    unlockAudio()
    clearTimers()
    finishRef.current = null
    setViewIdx(0)
    boards.slice(1).forEach((_, i) => timers.current.push(window.setTimeout(() => setViewIdx(i + 1), (i + 1) * STEP_MS)))
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) unlockAudio()
  }

  const scrub = (i: number) => {
    unlockAudio()
    finishRef.current?.() // jump to the end of playback first, then show the chosen step
    setViewIdx(i)
  }

  // ---- ghost previews ----------------------------------------------------------------
  const onHover = async (line: number): Promise<string | null> => {
    if (running || !started) return null
    const r = await api<{
      before: Board
      changed: { x: number; y: number; after: Block }[]
      text: string
      error?: { message: string }
    }>('/api/preview', { ...levelRef(level), code, line })
    if (!r.ok) return null
    if (r.data.error) {
      setGhost(null)
      return `**Preview unavailable:** ${r.data.error.message}`
    }
    setGhost(r.data.changed.length ? { line, before: r.data.before, changed: r.data.changed } : null)
    return r.data.text ? `**Ghost preview**\n\n${r.data.text}` : null
  }
  const onMouseLine = (line: number | null) => setGhost((g) => (g && g.line !== line ? null : g))

  // ---- hints -------------------------------------------------------------------------
  const askHint = async () => {
    if (running || !started || won) return
    const r = await api<HintReply>('/api/hint', { ...levelRef(level), code })
    if (!r.ok || !r.data.hint) {
      setStatus({ text: r.data.message ?? r.data.error?.message ?? 'No hint available', kind: 'info' })
      return
    }
    const h = r.data.hint
    setHints((n) => r.data.hints ?? n + 1)
    setFlash({ cells: h.cells, color: h.color })
    setStatus({
      text: `Hint: a ${h.kind}${h.kind === 'swap' ? ' between' : ' on'} the flashing ${h.cells.length > 1 ? 'blocks' : 'block'}${h.color ? ' (look at the swatch)' : ''}. This costs points and time.`,
      kind: 'info',
    })
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(null), FLASH_MS)
  }

  // ---- derived UI state --------------------------------------------------------------
  const lines = countLines(code)
  const shown = ghost ? ghost.before : boards[Math.min(viewIdx, boards.length - 1)]
  const atEnd = viewIdx === boards.length - 1
  const activeLine = viewIdx > 0 ? (stepLines[viewIdx - 1] ?? null) : null
  const statusColor = { info: 'text-ink', ok: 'text-emerald-700 dark:text-emerald-400', bad: 'text-magenta' }[status.kind]
  const isLast = levelIdx === levels.length - 1
  const idGrids = useMemo(() => buildIds(level.initialState, stepOps), [level, stepOps])
  const shownIds = ghost ? undefined : idGrids[Math.min(viewIdx, idGrids.length - 1)]
  const holds = level.property ? violations(shown, level.property) === 0 : null

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold uppercase tracking-tight">
            {level.custom ? `Custom: ${level.title}` : `Level ${level.id}: ${level.title}`}
            <span className="ml-3 border-2 border-ink bg-neon px-2 py-0.5 font-mono text-xs font-bold normal-case tracking-normal">Max lines: {level.parLimit}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {!fixedLevel && (
            <button data-testid="map-button" className="btn-paper px-3 py-1" onClick={() => setMapOpen(true)} title="See every level and your progress">
              🗺 Map
            </button>
          )}
          {!fixedLevel && (
          <label className="flex items-center gap-2">
            Level
            <select data-testid="level-select" value={levelIdx} onChange={(e) => selectLevel(Number(e.target.value))} className="btn-paper px-2 py-1">
              {levels.map((l, i) => (
                <option key={levelKey(l)} value={i}>
                  {solved.has(levelKey(l)) ? '✓ ' : ''}
                  {l.custom ? `★ ${l.title}` : `${l.id}. ${l.title}`}
                </option>
              ))}
            </select>
          </label>
          )}
        </div>
      </div>

      <LevelMap open={mapOpen} onClose={() => setMapOpen(false)} current={levelIdx} solvedNow={solved} onPick={selectLevel} />

      <p className="mb-5 max-w-5xl border-l-8 border-magenta pl-4 text-base font-medium leading-snug">{level.description}</p>

      <div className="mb-4 flex flex-wrap items-center gap-3" data-testid="hud">
        <span className="border-4 border-ink bg-abyss px-3 py-1 font-mono text-xl font-medium text-neon shadow-[4px_4px_0_#e4007c]" data-testid="timer">⏱ {fmt(elapsed)}</span>
        <span className="border-[3px] border-ink bg-card px-2 py-1 font-mono text-xs font-bold" data-testid="lines">lines {lines}/{level.parLimit}</span>
        {hints > 0 && <span className="border-[3px] border-ink bg-magenta px-2 py-1 font-mono text-xs font-bold text-white" data-testid="hints">hints used: {hints}</span>}
      </div>

      <div className="grid items-stretch gap-9 md:grid-cols-[1.15fr_1fr]">
        <section className="panel-heavy p-4">
          <ProofEditor
            value={code}
            resetKey={key}
            readOnly={!started}
            onChange={(v) => setCodes((c) => ({ ...c, [key]: v }))}
            activeLine={activeLine}
            errorLine={atEnd ? (error?.line ?? null) : null}
            errorText={error?.message ?? ''}
            onHover={onHover}
            onMouseLine={onMouseLine}
            insert={insert}
          />
          <p className="mt-3 font-mono text-xs font-medium">swap(x1, y1, x2, y2) · paint(x, y, color) · rotate(x, y) · def name(a, b)</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button onClick={run} disabled={running || !started || !!locked} className="btn-neon px-5 py-2">
              Run Proof
            </button>
            <button onClick={() => resetBoard(level)} disabled={!started} className="btn-paper px-4 py-2">
              Reset
            </button>
            <button data-testid="helper-button" onClick={() => setHelperOpen(true)} disabled={!started || !!locked} className="btn-paper px-4 py-2" title="Build a helper (def) with a form">
              🧩 Helper
            </button>
            <HelperBuilder open={helperOpen} onClose={() => setHelperOpen(false)} onInsert={(text, where) => setInsert((i) => ({ id: (i?.id ?? 0) + 1, text, where }))} />
            <button data-testid="hint-button" onClick={askHint} disabled={running || !started || won || !!locked} className="btn-magenta px-4 py-2" title="Costs 150 points and 30 seconds">
              Hint
            </button>
            {won && !isLast && !fixedLevel && (
              <button data-testid="next-level" onClick={() => selectLevel(levelIdx + 1)} className="btn-aqua px-5 py-2">
                Next Level →
              </button>
            )}
            {won && isLast && !fixedLevel && <span className="border-4 border-ink bg-neon px-3 py-1 font-extrabold">{level.custom ? 'Solved!' : `All ${LEVELS.length} levels complete!`}</span>}
            {engine && <span className="font-mono text-xs font-medium">engine: {engine}</span>}
          </div>
          <p data-testid="status" className={`mt-4 min-h-6 font-mono text-sm font-bold ${statusColor}`}>{status.text}</p>
          {won && (
            <div className="panel panel-neon mt-5 -rotate-1 p-4 text-sm" data-testid="score-card">
              {score ? (
                <>
                  <p className="text-4xl font-extrabold" data-testid="final-score">{score.total} points</p>
                  <p className="font-mono text-xs font-medium">
                    completion {score.base} + optimality {score.optimality} ({countLines(code)} lines vs {level.optimalLines} optimal) + speed {score.time} ({fmt(score.elapsedMs)}) − hints {score.hintPenalty}
                  </p>
                  <p className="mt-1 text-sm font-bold">{score.improved ? 'New personal best!' : `Your best on this level is ${score.best}.`}</p>
                </>
              ) : (
                <p>Solved! No new score was recorded: a score counts once per start, so reload the level (or pick another) to play for points.</p>
              )}
            </div>
          )}
        </section>

        <section className="panel-heavy relative flex flex-col items-center justify-center gap-5 p-5" data-testid="board-area">
          <div className="text-center">
            <p className="mb-3 inline-block bg-abyss px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">
              Current{boards.length > 1 ? ` · step ${viewIdx}/${boards.length - 1}` : ''}
              {ghost ? ' · ghost preview' : ''}
            </p>
            <div ref={boardRef} className={shake ? 'board-shake' : ''} data-testid="board">
              <BoardView board={shown} ids={shownIds} errorCells={atEnd && !ghost ? error?.cells : undefined} locked={level.locked} ghost={ghost?.changed} flash={flash} />
            </div>
          </div>
          <div className="w-full max-w-xs" data-testid="scrubber">
            <input
              type="range"
              aria-label="Time travel"
              className="w-full"
              min={0}
              max={boards.length - 1}
              value={Math.min(viewIdx, boards.length - 1)}
              disabled={boards.length < 2}
              onChange={(e) => scrub(Number(e.target.value))}
            />
            <div className="mt-1 flex items-center justify-center gap-2">
              <button data-testid="replay" onClick={replay} disabled={running || boards.length < 2} className="btn-paper px-2 py-1 text-xs">
                ▶ Replay with sound
              </button>
              <button data-testid="mute" onClick={toggleMute} className="btn-paper px-2 py-1 text-xs" aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted ? '🔇' : '🔊'}
              </button>
            </div>
            <p className="mt-2 text-center font-mono text-xs font-medium">
              {boards.length < 2 ? 'Run a proof to scrub through its steps' : viewIdx === 0 ? 'initial board' : `after line ${stepLines[viewIdx - 1]}`}
            </p>
          </div>
          <div className="text-center">
            <p className="mb-3 inline-block bg-abyss px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">Target</p>
            {level.targetState && <BoardView board={level.targetState} size="sm" locked={level.locked} />}
            {level.property && (
              <div className="max-w-md text-left" data-testid="theorem">
                <pre className="whitespace-pre-wrap border-4 border-ink bg-abyss p-3 font-mono text-xs text-neon">{theoremText(level.property)}</pre>
                <p className={`mt-1 font-mono text-xs font-bold ${holds ? 'text-emerald-700 dark:text-emerald-400' : 'text-magenta'}`} data-testid="theorem-status">
                  {holds ? 'isValid holds for the board shown ✓' : `isValid fails: ${violations(shown, level.property)} violation(s) on the board shown`}
                </p>
              </div>
            )}
          </div>

          {!started && (
            <div
              data-testid="start-overlay"
              className="hatch absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 border-4 border-ink bg-paper/95 p-4 text-center"
            >
              <p className="text-2xl font-extrabold uppercase tracking-tight">{level.custom ? level.title : `Level ${level.id}: ${level.title}`}</p>
              {locked ? (
                <p className="max-w-xs border-[3px] border-ink bg-neon px-3 py-2 text-sm font-bold" data-testid="locked-note">
                  {locked}
                </p>
              ) : (
                <>
                  <p className="max-w-xs text-sm font-semibold">
                    Max {level.parLimit} lines. The clock only ticks once you hit start, and the editor stays locked until then. Breathe first.
                  </p>
                  <button data-testid="start-level" onClick={startLevel} className="btn-neon px-8 py-3 text-xl uppercase">
                    {clock.base > 0 ? 'Resume Level' : 'Start Level'}
                  </button>
                </>
              )}
              {status.kind === 'bad' && <p className="border-[3px] border-ink bg-magenta px-2 py-1 text-sm font-bold text-white">{status.text}</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
