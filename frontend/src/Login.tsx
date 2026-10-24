import { useEffect, useState } from 'react'
import { api, session } from './api'

interface Props {
  onLogin: (name: string) => void
}

type Mode = 'signin' | 'signup'

/** Landing page: a Sign In / Sign Up toggle over one username + password form. */
export default function Login({ onLogin }: Props) {
  const [saved, setSaved] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!session.token()) return
    void api<{ name: string }>('/api/me').then((r) => {
      if (r.ok) setSaved(r.data.name)
      else if (r.status === 401) session.clear() // expired, forged or orphaned token; other errors may be a restarting server
    })
  }, [])

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setPassword('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      // both routes take { username, password } and answer with a JWT
      const r = await api<{ name: string; token: string; error?: string }>(mode === 'signin' ? '/api/login' : '/api/register', {
        username: username.trim(),
        password,
      })
      if (!r.ok) return setError(r.data.error ?? 'That did not work. Try again.')
      session.set(r.data.name, r.data.token)
      onLogin(r.data.name)
    } catch {
      setError("Can't reach the server. Is the backend awake?")
    } finally {
      setBusy(false)
    }
  }

  const signup = mode === 'signup'
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-8 px-5 py-10" data-testid="login">
      <div>
        <h1 className="inline-block -rotate-2 border-[5px] border-ink bg-neon px-4 py-1 text-5xl font-extrabold uppercase leading-none tracking-tight shadow-[8px_8px_0_#e4007c]">
          Proof Puzzle
        </h1>
        <p className="mt-6 max-w-sm text-lg font-semibold leading-snug">
          Shove colored blocks around with tiny programs. Fewer lines, faster hands, louder bragging rights.
        </p>
      </div>

      {saved && (
        <button data-testid="continue" onClick={() => onLogin(saved)} className="btn-aqua px-5 py-4 text-left text-lg">
          Pick up where you left off, <span className="font-mono">@{saved}</span> →
        </button>
      )}

      <form onSubmit={submit} className="panel-heavy flex rotate-1 flex-col gap-4 p-6">
        <div className="flex gap-3" role="group" aria-label="Sign in or sign up">
          <button type="button" data-testid="mode-signin" aria-pressed={!signup} onClick={() => switchMode('signin')} className={`flex-1 px-3 py-2 text-lg uppercase ${signup ? 'btn-paper' : 'btn-neon'}`}>
            Sign In
          </button>
          <button type="button" data-testid="mode-signup" aria-pressed={signup} onClick={() => switchMode('signup')} className={`flex-1 px-3 py-2 text-lg uppercase ${signup ? 'btn-neon' : 'btn-paper'}`}>
            Sign Up
          </button>
        </div>

        <h2 className="text-xl font-extrabold uppercase tracking-tight">{signup ? 'Make a new account.' : 'Welcome back, hacker.'}</h2>

        <label className="flex flex-col gap-1 text-sm font-bold" htmlFor="username">
          Username
          <input
            id="username"
            data-testid="username"
            required
            minLength={2}
            maxLength={20}
            autoFocus
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="lambda_wolf"
            className="px-3 py-2 font-mono text-lg font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold" htmlFor="password">
          Password
          <input
            id="password"
            data-testid="password"
            type="password"
            required
            minLength={signup ? 8 : undefined}
            maxLength={72}
            autoComplete={signup ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={signup ? '8 or more characters' : 'your password'}
            className="px-3 py-2 font-mono text-lg font-normal"
          />
        </label>

        {signup && <p className="font-mono text-xs">Username: 2-20 characters (letters, digits, _ or -). Password: 8-72 characters.</p>}
        {error && (
          <p className="border-[3px] border-ink bg-magenta px-3 py-2 text-sm font-bold text-white" data-testid="login-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          data-testid="auth-submit"
          disabled={busy || username.trim().length < 2 || password.length < (signup ? 8 : 1)}
          className="btn-neon px-4 py-3 text-lg uppercase"
        >
          {signup ? 'Create account ▸' : 'Sign in ▸'}
        </button>
        <p className="text-center text-sm font-semibold">
          {signup ? 'Already have an account? ' : 'No account yet? '}
          <button type="button" className="btn-bare" onClick={() => switchMode(signup ? 'signin' : 'signup')}>
            {signup ? 'Switch to Sign In' : 'Switch to Sign Up'}
          </button>
        </p>
      </form>
    </main>
  )
}
