import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import BoardView from './BoardView'
import ProofEditor from './ProofEditor'
import { API_URL, session } from './api'
import { customToLevel, decodeCustom } from './data/levels'
import type { Board, Level } from './data/levels'
import { celebrate } from './effects'
import type { EvalError } from './types'

const clone = (b: Board): Board => b.map((r) => r.map((c) => ({ ...c })))
const starter = '-- Battle! Be the first to solve it.\n'

interface Battle { level: Level; opponent: string; seq: number }
interface Opponent { error: boolean; solved: boolean; lines: number; compiles: number }
interface Over { youWon: boolean; reason: 'solved' | 'forfeit'; winner: string | null; lines: Record<string, number> }

/**
 * `/battle`: queue up, get matched with another player, and race on a puzzle that was generated for this match
 * (nobody has seen it, and it is unranked). After every compile the server sends the opponent's resulting board
 * (never their code), shown here as a small read-only grid. The first verified solution ends the battle.
 */
export default function BattlePage() {
  const socketRef = useRef<Socket | null>(null)
  const roomRef = useRef<HTMLDivElement>(null)
  // the proof that was last sent to the server, so a solved result can claim the win with exactly that code
  const submitted = useRef('')
  const [connected, setConnected] = useState(false)
  const [offline, setOffline] = useState('')
  const [searching, setSearching] = useState(false)
  const [battle, setBattle] = useState<Battle | null>(null)
  const [over, setOver] = useState<Over | null>(null)

  const [code, setCode] = useState(starter)
  const [myBoard, setMyBoard] = useState<Board | null>(null)
  const [myError, setMyError] = useState<EvalError | null>(null)
  const [status, setStatus] = useState('')
  const [compiling, setCompiling] = useState(false)
  const [oppBoard, setOppBoard] = useState<Board | null>(null)
  const [opp, setOpp] = useState<Opponent | null>(null)

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
    socket.on('battle:start', (s: { level: string; opponent: string }) => {
      const generated = customToLevel(decodeCustom(s.level))
      const level = { ...generated, description: 'A fresh puzzle made for this match, so nobody has seen it. Make your board match the target before your opponent does.' }
      setSearching(false)
      setOver(null)
      setCode(starter)
      setStatus('')
      setMyError(null)
      setMyBoard(clone(level.initialState))
      setOppBoard(clone(level.initialState))
      setOpp(null)
      setBattle((b) => ({ level, opponent: s.opponent, seq: (b?.seq ?? 0) + 1 }))
    })
    socket.on('battle:result', (r: { board: Board; error: EvalError | null; solved: boolean; message: string }) => {
      setCompiling(false)
      setMyBoard(r.board)
      setMyError(r.error)
      setStatus(r.error ? `Line ${r.error.line}: ${r.error.message}` : r.message)
      // the server says this proof solves the puzzle: claim the win (the server checks the claim again)
      if (r.solved) socket.emit('board_solved', { code: submitted.current })
    })
    socket.on('battle:opponent', (o: { board: Board } & Opponent) => {
      setOppBoard(o.board)
      setOpp({ error: o.error, solved: o.solved, lines: o.lines, compiles: o.compiles })
    })
    socket.on('battle_over', (o: Over) => {
      setCompiling(false)
      setOver(o)
      if (o.youWon && o.reason === 'solved') celebrate(roomRef.current)
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
    setStatus('Crunching your proof…')
    submitted.current = code
    socketRef.current?.emit('battle:compile', { code })
  }

  const playing = battle !== null && !over

  if (!battle) {
    return (
      <section className="panel-heavy mx-auto max-w-md rotate-1 p-8 text-center" data-testid="battle-lobby">
        <h2 className="mb-3 inline-block -rotate-2 border-4 border-ink bg-neon px-3 py-1 text-3xl font-extrabold uppercase tracking-tight">Proof Battle</h2>
        <p className="mb-5 font-semibold">Get paired with a stranger on a puzzle made just for the two of you. First correct proof takes the glory.</p>
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
    <div ref={roomRef} data-testid="battle-room">
      <div className="mb-3">
        <p className="text-2xl font-extrabold uppercase tracking-tight">
          Battle vs <span className="bg-magenta px-2 text-white" data-testid="opponent-name">{battle.opponent}</span>
          <span className="ml-3 font-mono text-xs font-bold normal-case tracking-normal">
            {level.gridSize}x{level.gridSize} · par {level.parLimit} lines · unranked
          </span>
        </p>
      </div>
      <p className="mb-5 max-w-3xl border-l-8 border-magenta pl-4 text-base font-medium leading-snug">{level.description}</p>

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
            resetKey={`battle-${battle.seq}`}
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
        </section>

        <section className="panel shadow-magenta flex flex-col items-center gap-5 p-5 md:mt-10 md:rotate-[0.6deg]">
          {/* the goal comes first, at the very top... */}
          <div className="flex flex-col items-center text-center" data-testid="target-panel">
            <p className="mb-3 inline-block bg-abyss px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">Target</p>
            {level.targetState && <BoardView board={level.targetState} size="md" testPrefix="tgt" />}
          </div>
          {/* ...then you and your opponent next to each other, at the same size so the race is easy to read */}
          <div className="flex flex-row flex-wrap justify-center gap-4" data-testid="boards-row">
            <div className="flex flex-col items-center text-center" data-testid="my-panel">
              <p className="mb-3 inline-block bg-abyss px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">You</p>
              {myBoard && <BoardView board={myBoard} size="md" errorCells={myError?.cells} testPrefix="me" />}
            </div>
            <div className="flex flex-col items-center text-center" data-testid="opponent-panel">
              <p className="mb-3 inline-block bg-abyss px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-neon">{battle.opponent} (live)</p>
              {oppBoard && <BoardView board={oppBoard} size="md" testPrefix="opp" />}
              {/* w-0 + min-w-full: the text wraps to the width of the board instead of widening the column */}
              <p className="mt-2 w-0 min-w-full font-mono text-xs font-medium" data-testid="opponent-info">
                {opp
                  ? `${opp.compiles} compile${opp.compiles === 1 ? '' : 's'} · ${opp.lines} lines · ${opp.solved ? 'solved!' : opp.error ? 'last run had an error' : 'last run compiled'}`
                  : "hasn't compiled a thing yet"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
