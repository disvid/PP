import confetti from 'canvas-confetti'

const COLORS = ['#22d3ee', '#6366f1', '#4ade80', '#facc15', '#f87171', '#c084fc']

/** A celebratory burst that starts at the middle of `el` (the game board). Skipped for reduced-motion users. */
export function celebrate(el: HTMLElement | null) {
  const r = el?.getBoundingClientRect()
  const origin = r
    ? { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }
    : { x: 0.5, y: 0.6 }
  const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 2000 }
  confetti({ ...base, particleCount: 110, spread: 85, startVelocity: 42, origin })
  window.setTimeout(() => confetti({ ...base, particleCount: 50, angle: 60, spread: 60, origin: { x: Math.max(0, origin.x - 0.12), y: origin.y } }), 180)
  window.setTimeout(() => confetti({ ...base, particleCount: 50, angle: 120, spread: 60, origin: { x: Math.min(1, origin.x + 0.12), y: origin.y } }), 180)
}
