import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { onAchievements } from './achievementBus'
import { ACHIEVEMENT_BY_KEY } from './data/achievements'
import type { Tier } from './data/achievements'

// eslint-disable-next-line react-refresh/only-export-components
export const TIER_STYLE: Record<Tier, string> = {
  bronze: 'bg-magenta text-white',
  silver: 'bg-aqua text-[#0a0a0a]',
  gold: 'bg-neon text-[#0a0a0a]',
}

interface Toast { id: number; key: string }
let nextId = 1
const SHOW_MS = 6500

/** Pop-ups for freshly unlocked badges, stacked in the bottom-right corner. Clicking one opens the Achievements page. */
export default function AchievementToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const navigate = useNavigate()

  useEffect(
    () =>
      onAchievements((keys) => {
        const fresh = keys.filter((k) => ACHIEVEMENT_BY_KEY[k]).map((key) => ({ id: nextId++, key }))
        setToasts((t) => [...t, ...fresh])
        for (const f of fresh) window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== f.id)), SHOW_MS)
      }),
    [],
  )

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[1100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3" data-testid="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const a = ACHIEVEMENT_BY_KEY[t.key]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ x: 60, opacity: 0, rotate: 2 }}
              animate={{ x: 0, opacity: 1, rotate: -0.6 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="panel-heavy pointer-events-auto flex cursor-pointer items-center gap-3 p-3"
              data-testid="toast"
              data-achievement={a.key}
              onClick={() => {
                dismiss(t.id)
                navigate('/achievements')
              }}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center border-4 border-ink text-2xl ${TIER_STYLE[a.tier]}`}>{a.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[0.65rem] font-bold uppercase tracking-widest text-magenta dark:text-neon">Achievement unlocked</span>
                <span className="block text-lg font-extrabold uppercase leading-tight">{a.title}</span>
                <span className="block text-xs font-medium leading-snug">{a.description}</span>
              </span>
              <button
                aria-label="Dismiss"
                className="btn-bare self-start text-sm no-underline"
                onClick={(e) => {
                  e.stopPropagation()
                  dismiss(t.id)
                }}
              >
                ✕
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
