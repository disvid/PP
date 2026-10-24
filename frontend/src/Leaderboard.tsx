import { useCallback, useEffect, useState } from 'react'
import { api } from './api'
import type { BoardRow } from './api'
import { LEVELS } from './data/levels'

interface Props {
  player: string
}

export default function Leaderboard({ player }: Props) {
  const [tab, setTab] = useState<'global' | 'friends'>('global')
  const [level, setLevel] = useState('')
  const [rows, setRows] = useState<BoardRow[]>([])
  const [friends, setFriends] = useState<string[]>([])
  const [friendName, setFriendName] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const q = level ? `?level=${encodeURIComponent(level)}` : ''
    const r = await api<BoardRow[]>(`/api/leaderboard/${tab}${q}`)
    setRows(r.ok && Array.isArray(r.data) ? r.data : [])
    const me = await api<{ friends: string[] }>('/api/me')
    if (me.ok) setFriends(me.data.friends)
  }, [tab, level])

  useEffect(() => {
    void load()
  }, [load])

  const addFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await api<{ friends: string[]; error?: string }>('/api/friends', { name: friendName.trim() })
    if (!r.ok) return setMsg(r.data.error ?? 'Could not add friend')
    setFriends(r.data.friends)
    setFriendName('')
    setMsg('')
    void load()
  }

  const field = 'px-2 py-1 text-sm'
  return (
    <section className="panel-heavy mx-auto max-w-3xl -rotate-[0.4deg] p-6" data-testid="leaderboard-view">
      <h2 className="mb-5 inline-block border-4 border-ink bg-abyss px-3 py-1 text-2xl font-extrabold uppercase tracking-tight text-neon">Hall of Proofs</h2>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        {(['global', 'friends'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 ${tab === t ? 'btn-neon' : 'btn-paper'}`}>
            {t === 'global' ? 'Global' : 'Friends'}
          </button>
        ))}
        <select className={`${field} ml-2`} value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level filter">
          <option value="">All levels</option>
          {LEVELS.map((l) => (
            <option key={l.id} value={String(l.id)}>
              {l.id}. {l.title}
            </option>
          ))}
        </select>
      </div>

      <table className="board-table mb-6 w-full border-[3px] border-ink text-left text-sm font-semibold" data-testid="leaderboard">
        <thead>
          <tr>
            <th className="py-1">#</th>
            <th>Player</th>
            <th>Points</th>
            <th>Optimality</th>
            <th>Speed</th>
            <th>Solved</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className={`lift-row ${r.name === player ? 'bg-aqua' : ''}`}>
              <td className="font-mono font-black">#{r.rank}</td>
              <td className="font-mono">@{r.name}</td>
              <td>{r.points}</td>
              <td>{r.optimality}</td>
              <td>{r.speed}</td>
              <td>{r.solved}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-base font-bold">
                {tab === 'friends'
                  ? friends.length === 0
                    ? 'Your rivals list is empty. Add a friend and start a feud.'
                    : "Your crew hasn't posted a score here yet. Suspicious."
                  : "Nobody's on the board yet. The throne is vacant, go sit on it."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={addFriend} className="flex flex-wrap items-center gap-2 text-sm">
        <input className={field} placeholder="alias of a rival or friend" value={friendName} onChange={(e) => setFriendName(e.target.value)} />
        <button className="btn-aqua px-3 py-1" disabled={friendName.trim().length < 2}>
          Recruit
        </button>
        {friends.length > 0 && <span className="font-mono text-xs">crew: {friends.map((f) => `@${f}`).join(' ')}</span>}
        {msg && <span className="border-2 border-ink bg-magenta px-2 py-0.5 text-xs font-bold text-white">{msg}</span>}
      </form>
    </section>
  )
}
