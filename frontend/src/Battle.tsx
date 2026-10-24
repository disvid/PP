import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import BoardView from './BoardView'
import ProofEditor from './ProofEditor'
import { API_URL, session } from './api'
import { LEVELS, theoremText } from './data/levels'
import type { Board, Level } from './data/levels'
import type { EvalError } from './types'

const clone = (b: Board): Board => b.map((r) => r.map((c) => ({ ...c })))
const pad = (n: number) => String(n).padStart(2, '0')
const fmt = (ms: number) => `${pad(Math.floor(Math.max(0, ms) / 60000))}:${pad(Math.floor(Math.max(0, ms) / 1000) % 60)}`
const starter = '-- Battle! Be the first to solve it.\n'

interface Battle { level: Level; opponent: string; startsAt: number }
interface Opponent { error: boolean; solved: boolean; lines: number; compiles: number }
interface Over { youWon: boolean; reason: 'solved' | 'forfeit'; winner: string | null; lines: Record<string, number> }

/**
 * `/battle`: queue up, get matched with another player on the same puzzle, and race. After every compile the
 * server sends the opponent's resulting board (never their code), shown here as a small read-only grid.
 */
export default function BattlePage() {
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [offline, setOffline] = useState('')
  const [searching, setSearching] = useState(false)
  const [battle, setBattle] = useState<Battle | null>(null)
  const [over, setOver] = useState<Over | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const [code, setCode] = useState(starter)
  const [myBoard, setMyBoard] = useState<Board | null>(null)
  const [myError, setMyError] = useState<EvalError | null>(null)
  const [status, setStatus] = useState('')
  const [compiling, setCompiling] = useState(false)
  const [oppBoard, setOppBoard] = useState<Board | null>(null)
  const [opp, setOpp] = useState<Opponent | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // Socket.IO talks to the same backend as the REST calls (same origin in development, through the Vite proxy)
    const socket = io(API_URL || undefined, { auth: { token: session.token() } })
    socketRef.current = socket
    socket.on('connect', () => {
      setConnected(true)
      setOffline('')
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', (e) => setOffline(e.message === 'unauthorized' ? 'Sign in again to battle.' : 'Cannot reach the battle server.'))

    socket.on('queue:state', (s: { status: string }) => setSearching(s.status === 'searching'))
    socket.on('battle:start', (s: { levelId: number; opponent: string; startsAt: number; now: number }) => {
      const level = LEVELS.find((l) => l.id === s.levelId)!
      setSearching(false)
      setOver(null)
      setCode(starter)
      setStatus('')
      setMyError(null)
      setMyBoard(clone(level.initialState))
      setOppBoard(clone(level.initialState))
      setOpp(null)
      // the server's clock may differ from ours: shift the start time by the measured offset
      setBattle({ level, opponent: s.opponent, startsAt: s.startsAt - s.now + Date.now() })
    })
    socket.on('battle:result', (r: { board: Board; error: EvalError | null; solved: boolean; message: string }) => {
      setCompiling(false)
      setMyBoard(r.board)
      setMyError(r.error)
      setStatus(r.error ? `Line ${r.error.line}: ${r.error.message}` : r.message)
    })
    socket.on('battle:opponent', (o: { board: Board } & Opponent) => {
      setOppBoard(o.board)
      setOpp({ error: o.error, solved: o.solved, lines: o.lines, compiles: o.compiles })
    })
    socket.on('battle:over', (o: Over) => {
      setCompiling(false)
      setOver(o)
    })
    socket.on('battle:error', (e: { message: string }) => {
      setCompiling(false)
      setStatus(e.message)
    })
    return () => {
      socket.disconnect() // leaving mid-battle forfeits it
      socketRef.current = null
    }
  }, [])

  const findMatch = () => {
    setBattle(null)
    setOver(null)
    socketRef.current?.emit('queue:join')
  }
  const cancelSearch = () => socketRef.current?.emit('queue:leave')
  const compile = () => {
    setCompiling(true)
    setStatus('Compiling…')
    socketRef.current?.emit('battle:compile', { code })
  }

  const started = battle !== null && now >= battle.startsAt
  const countdown = battle ? Math.ceil((battle.startsAt - now) / 1000) : 0
  const playing = started && !over

  if (!battle) {
    return (
      <section className="panel-heavy mx-auto max-w-md rotate-1 p-8 text-center" data-testid="battle-lobby">
        <h2 className="mb-3 inline-block -rotate-2 border-4 border-ink bg-neon px-3 py-1 text-3xl font-extrabold uppercase tracking-tight">Proof Battle</h2>
        <p className="mb-5 font-semibold">Get paired with a stranger, same puzzle, no mercy. First correct proof takes the glory.</p>
        {offline && <p className="mb-3 border-[3px] border-ink bg-magenta px-2 py-1 text-sm font-bold text-white">{offline}</p>}
        {searching ? (
          <>
            <p className="mb-4 animate-pulse font-mono font-bold" data-testid="battle-searching">scanning the arena for a worthy opponent…</p>
            <button onClick={cancelSearch} className="btn-paper px-4 py-2">
              Cancel
            </button>
          </>
        ) : (
          <button data-testid="find-match" onClick={findMatch} disabled={!connected} className="btn-neon px-8 py-3 text-lg uppercase">
            {connected ? 'Find an opponent' : 'plugging in…'}
          </button>
        )}
      </section>
    )
  }

  const level = battle.level
  return (
    <div data-testid="battle-room">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-2xl font-extrabold uppercase tracking-tight">
          Battle vs <span className="bg-magenta px-2 text-white" data-testid="opponent-name">{battle.opponent}</span>
          <span className="ml-3 font-mono text-xs font-bold normal-case tracking-normal">
            {level.title} · par {level.parLimit} lines
          </span>
        </p>
        <span className="border-4 border-ink bg-ink px-3 py-1 font-mono text-xl font-medium text-neon shadow-[4px_4px_0_#e4007c]" data-testid="battle-timer">⏱ {started ? fmt(now - battle.startsAt) : '00:00'}</span>
      </div>
      {started && <p className="mb-5 max-w-3xl border-l-8 border-magenta pl-4 text-base font-medium leading-snug">{level.description}</p>}

      {over && (
        <div className={`panel mb-5 -rotate-1 p-4 ${over.youWon ? 'panel-neon' : 'panel-magenta'}`} data-testid="battle-over">
          <p className="text-3xl font-extrabold uppercase">{over.youWon ? 'You won! 🏆' : `${over.winner ?? 'Your opponent'} won`}</p>
          <p className="text-sm font-semibold">
            {over.reason === 'forfeit' ? (over.youWon ? 'Your opponent left the battle.' : 'You left the battle.') : 'First correct proof wins.'}
            {over.reason === 'solved' && ` Lines: ${Object.entries(over.lines).map(([n, l]) => `${n} ${l}`).join(', ')}.`}
          </p>
          <button data-testid="play-again" onClick={findMatch} className="btn-aqua mt-3 px-4 py-2">
            Find another opponent
          </button>
        </div>
      )}

      <div className="grid items-start gap-9 md:grid-cols-[1.15fr_1fr]">
        <section className="panel-heavy relative p-4 md:-ml-2">
          <ProofEditor
            value={code}
            resetKey={`${level.id}-${battle.startsAt}`}
            readOnly={!playing}
            onChange={setCode}
            activeLine={null}
            errorLine={myError?.line ?? null}
            errorText={myError?.message ?? ''}
            onHover={async () => null}
            onMouseLine={() => {}}
          />
          <div className="mt-3 flex items-center gap-3">
            <button data-testid="battle-run" onClick={compile} disabled={!playing || compiling} className="btn-neon px-5 py-2">
              Run Proof
            </button>
          </div>
          <p className="mt-4 min-h-6 font-mono text-sm font-bold" data-testid="battle-status">{status}</p>
          {!started && (
            <div className="hatch absolute inset-0 z-10 flex items-center justify-center border-4 border-ink bg-paper/95 text-center" data-testid="countdown">
              <div>
                <p className="font-mono text-sm font-bold uppercase">Matched! Fight starts in</p>
                <p className="text-8xl font-black">{Math.max(countdown, 1)}</p>
              </div>
            </div>
          )}
        </section>

        <section className="panel shadow-magenta flex flex-col items-center gap-5 p-5 md:mt-10 md:rotate-[0.6deg]">
          <div className="text-center">
            <p className="mb-3 inline-block bg-ink px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">You</p>
            {myBoard && <BoardView board={myBoard} errorCells={myError?.cells} testPrefix="me" />}
          </div>
          <div className="text-center" data-testid="opponent-panel">
            <p className="mb-3 inline-block bg-ink px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">{battle.opponent} (live)</p>
            {oppBoard && <BoardView board={oppBoard} size="sm" testPrefix="opp" />}
            <p className="mt-2 font-mono text-xs font-medium" data-testid="opponent-info">
              {opp
                ? `${opp.compiles} compile${opp.compiles === 1 ? '' : 's'} · ${opp.lines} lines · ${opp.solved ? 'solved!' : opp.error ? 'last run had an error' : 'last run compiled'}`
                : "hasn't compiled a thing yet"}
            </p>
          </div>
          <div className="text-center">
            <p className="mb-3 inline-block bg-ink px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">Target</p>
            {level.targetState && <BoardView board={level.targetState} size="sm" testPrefix="tgt" />}
            {level.property && (
              <pre className="max-w-md whitespace-pre-wrap border-4 border-ink bg-ink p-3 text-left font-mono text-xs text-neon">{theoremText(level.property)}</pre>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
