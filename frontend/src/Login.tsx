import { useEffect, useState } from 'react'
import { api, session } from './api'

interface Props {
  onLogin: (name: string) => void
}

/** Landing page. One form for both cases: a known username must give its password, an unknown one is registered with it. */
export default function Login({ onLogin }: Props) {
  const [saved, setSaved] = useState<string | null>(null)
  const [name, setName] = useState('')
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

  const join = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      // a known username must present its password; an unknown one is registered with the password given
      const r = await api<{ name: string; token: string; error?: string }>('/api/login', { name: name.trim(), password })
      if (!r.ok) return setError(r.data.error ?? 'That login bounced. Try again.')
      session.set(r.data.name, r.data.token)
      onLogin(r.data.name)
    } catch {
      setError("Can't reach the server. Is the backend awake?")
    } finally {
      setBusy(false)
    }
  }

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

      <form onSubmit={join} className="panel-heavy flex rotate-1 flex-col gap-4 p-6">
        <label className="text-xl font-extrabold uppercase tracking-tight" htmlFor="username">
          {saved ? 'Or become someone else' : 'Enter your credentials to initialize.'}
        </label>
        <input
          id="username"
          data-testid="username"
          autoFocus
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="username (lambda_wolf)"
          className="px-3 py-2 font-mono text-lg"
        />
        <input
          id="password"
          data-testid="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password (8+ characters)"
          className="px-3 py-2 font-mono text-lg"
        />
        <p className="font-mono text-xs">
          Username: 2-20 chars (letters, digits, _ or -). Password: 8-72 chars. New username? We&apos;ll create the account with this password. Known username? Prove it&apos;s you.
        </p>
        {error && (
          <p className="border-[3px] border-ink bg-magenta px-3 py-2 text-sm font-bold text-white" data-testid="login-error">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy || name.trim().length < 2 || password.length < 8} className="btn-neon px-4 py-3 text-lg uppercase">
          Initialize ▸
        </button>
      </form>
    </main>
  )
}
