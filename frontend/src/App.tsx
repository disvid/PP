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
import { ThemeToggle } from './theme'
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
  // the How to Play overlay: opened by the top-bar button and right after signing in, closed by Play! / Esc / the X
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false)

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
              setIsHowToPlayOpen(true) // the rules pop up right after signing in
            }}
          />
        }
      />
      <Route
        element={
          <RequireAuth
            player={player}
            onSignOut={() => setPlayer(null)}
            isHowToPlayOpen={isHowToPlayOpen}
            setIsHowToPlayOpen={setIsHowToPlayOpen}
          />
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

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H3.5v1.5A3.5 3.5 0 0 0 7 11M17 6h3.5v1.5A3.5 3.5 0 0 1 17 11" />
      <path d="M12 14v4M8 20h8" />
    </svg>
  )
}

interface AuthProps {
  player: string | null
  onSignOut: () => void
  isHowToPlayOpen: boolean
  setIsHowToPlayOpen: (open: boolean) => void
}

function RequireAuth({ player, onSignOut, isHowToPlayOpen, setIsHowToPlayOpen }: AuthProps) {
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
      <header className="panel-ink mb-8 grid items-center gap-x-4 gap-y-3 px-5 py-3 md:grid-cols-[1fr_auto_1fr]">
        {/* left: logo plus the two icon shortcuts */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="-rotate-2 border-4 border-ink bg-neon px-3 py-0.5 text-2xl font-extrabold uppercase tracking-tight text-ink shadow-[4px_4px_0_#e4007c]">
            Swappr
          </h1>
          <HowToPlay open={isHowToPlayOpen} onOpen={() => setIsHowToPlayOpen(true)} onClose={() => setIsHowToPlayOpen(false)} />
          <NavLink
            to="/leaderboard"
            aria-label="Leaderboard"
            title="Leaderboard"
            data-testid="nav-leaderboard"
            className={({ isActive }) => `btn btn-icon ${isActive ? 'btn-neon -translate-y-0.5' : 'btn-paper'}`}
          >
            <TrophyIcon />
          </NavLink>
        </div>
        {/* center: the game modes */}
        <nav className="flex flex-wrap items-center justify-center gap-2.5">
          <NavLink to="/game" className={link} data-testid="nav-game">Game</NavLink>
          <NavLink to="/daily" className={link} data-testid="nav-daily">Daily</NavLink>
          <NavLink to="/battle" className={link} data-testid="nav-battle">Battle</NavLink>
          <NavLink to="/builder" className={link} data-testid="nav-builder">Level Builder</NavLink>
        </nav>
        {/* right: theme and who you are */}
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <ThemeToggle />
          <span className="text-sm font-semibold text-bone">
            <span className="font-mono text-neon">@{player}</span> ·{' '}
            <button className="btn-bare !text-bone hover:!text-neon" onClick={signOut} data-testid="sign-out">
              bail out
            </button>
          </span>
        </div>
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
