import { useEffect, useState } from 'react'
import { api, session } from './api'

interface Props {
  onLogin: (name: string) => void
}

/** Landing page. Accounts are alias-only: an existing alias signs back in, a new one is created. */
export default function Login({ onLogin }: Props) {
  const [saved, setSaved] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!session.token()) return
    void api<{ name: string }>('/api/me').then((r) => {
      if (r.ok) setSaved(r.data.name)
      else session.clear() // stale token (e.g. the server database was reset)
    })
  }, [])

  const join = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      // an existing alias signs that player back in; a new alias registers it
      const r = await api<{ name: string; token: string; error?: string }>('/api/login', { name: name.trim() })
      if (!r.ok) return setError(r.data.error ?? 'That alias bounced. Try another.')
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
          {saved ? 'Or become someone else' : 'Enter your alias to initialize.'}
        </label>
        <input
          id="username"
          data-testid="username"
          autoFocus
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="lambda_wolf"
          className="px-3 py-2 font-mono text-lg"
        />
        <p className="font-mono text-xs">2-20 chars: letters, digits, _ or -. Brand-new alias? We&apos;ll mint it. Known alias? Welcome back.</p>
        {error && (
          <p className="border-[3px] border-ink bg-magenta px-3 py-2 text-sm font-bold text-white" data-testid="login-error">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy || name.trim().length < 2} className="btn-neon px-4 py-3 text-lg uppercase">
          Initialize ▸
        </button>
      </form>
    </main>
  )
}
