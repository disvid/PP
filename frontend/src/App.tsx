import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Battle from './Battle'
import Builder from './Builder'
import Daily from './Daily'
import HowToPlay from './HowToPlay'
import Game, { gameControl } from './Game'
import type { GameStore } from './Game'
import Leaderboard from './Leaderboard'
import Login from './Login'
import { api, session } from './api'
import { LEVELS, customToLevel, decodeCustom } from './data/levels'
import type { Level } from './data/levels'

/**
 * Routes: `/` login, `/game`, `/daily`, `/battle`, `/builder`, `/leaderboard`. Every route except `/` requires a signed-in player,
 * and each page is its own route element, so the Game is unmounted (not hidden) while the builder or the
 * leaderboard is on screen.
 */
export default function App() {
  const [player, setPlayer] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)
  // true from the moment someone signs in until they close the rules
  const [guideOpen, setGuideOpen] = useState(false)

  // game progress kept above the Game route, because leaving the route unmounts the Game
  const [levelIdx, setLevelIdx] = useState(0)
  const [customLevel, setCustomLevel] = useState<Level | null>(null)
  const [codes, setCodes] = useState<Record<string, string>>({})
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const store: GameStore = { levelIdx, setLevelIdx, customLevel, setCustomLevel, codes, setCodes, solved, setSolved }

  // resume a saved session so that deep links like /game keep working after a reload
  useEffect(() => {
    if (!session.token()) return setAuthReady(true)
    api<{ name: string }>('/api/me')
      .then((r) => {
        if (r.ok) setPlayer(r.data.name)
        else if (r.status === 401) session.clear() // expired, forged or orphaned token (e.g. the database was reset)
      })
      .catch(() => {})
      .finally(() => setAuthReady(true))
  }, [])

  if (!authReady) {
    return <p className="p-10 font-mono text-lg font-bold">warming up the chalkboard…</p>
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginRoute
            onLogin={(name) => {
              setPlayer(name)
              setGuideOpen(true) // the rules pop up right after signing in
            }}
          />
        }
      />
      <Route
        element={
          <RequireAuth player={player} onSignOut={() => setPlayer(null)} guideOpen={guideOpen} onGuideClose={() => setGuideOpen(false)} />
        }
      >
        <Route path="/game" element={<Game store={store} />} />
        <Route path="/daily" element={<Daily store={store} />} />
        <Route path="/battle" element={<Battle />} />
        <Route
          path="/builder"
          element={
            <BuilderPage
              onPlay={(payload) => {
                setCustomLevel(customToLevel(decodeCustom(payload)))
                setLevelIdx(LEVELS.length)
              }}
            />
          }
        />
        <Route path="/leaderboard" element={<Leaderboard player={player ?? ''} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function LoginRoute({ onLogin }: { onLogin: (name: string) => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  // go back to where the player was heading, keeping a shared ?level= link
  const dest = (location.state as { from?: string } | null)?.from ?? `/game${location.search}`
  return (
    <Login
      onLogin={(name) => {
        onLogin(name)
        navigate(dest, { replace: true })
      }}
    />
  )
}

interface AuthProps {
  player: string | null
  onSignOut: () => void
  guideOpen: boolean
  onGuideClose: () => void
}

function RequireAuth({ player, onSignOut, guideOpen, onGuideClose }: AuthProps) {
  const location = useLocation()
  const navigate = useNavigate()
  if (!player) return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />

  const signOut = async () => {
    await gameControl.pause?.() // stop the level clock while the token is still valid
    session.clear()
    onSignOut()
    navigate('/', { replace: true })
  }
  const link = ({ isActive }: { isActive: boolean }) =>
    `btn px-3 py-1 text-sm ${isActive ? 'btn-neon -translate-y-0.5' : 'btn-paper'}`

  return (
    <div className="mx-auto max-w-6xl px-5 pb-12 pt-6">
      <header className="panel-ink mb-8 flex flex-wrap items-center justify-between gap-4 px-5 py-3">
        <h1 className="-rotate-2 border-4 border-ink bg-neon px-3 py-0.5 text-2xl font-extrabold uppercase tracking-tight text-ink shadow-[4px_4px_0_#e4007c]">
          Proof Puzzle
        </h1>
        <nav className="flex flex-wrap items-center gap-2.5">
          <HowToPlay player={player} autoOpen={guideOpen} onAutoClose={onGuideClose} />
          <NavLink to="/game" className={link} data-testid="nav-game">Game</NavLink>
          <NavLink to="/daily" className={link} data-testid="nav-daily">Daily</NavLink>
          <NavLink to="/battle" className={link} data-testid="nav-battle">Battle</NavLink>
          <NavLink to="/builder" className={link} data-testid="nav-builder">Level Builder</NavLink>
          <NavLink to="/leaderboard" className={link} data-testid="nav-leaderboard">Leaderboard</NavLink>
          <span className="ml-2 text-sm font-semibold text-paper">
            <span className="font-mono text-neon">@{player}</span> ·{' '}
            <button className="btn-bare !text-paper hover:!text-neon" onClick={signOut} data-testid="sign-out">
              bail out
            </button>
          </span>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

function BuilderPage({ onPlay }: { onPlay: (payload: string) => void }) {
  const navigate = useNavigate()
  return (
    <Builder
      onPlay={(payload) => {
        onPlay(payload)
        navigate(`/game?level=${payload}`)
      }}
    />
  )
}
