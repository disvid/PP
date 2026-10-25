// Tiny event bus: any page that learns about newly unlocked badges (a solved level, a won battle, the tutorial) announces
// them here, and the toasts in App.tsx show them. It lives outside React so Game, Battle and the tutorial need no context.
type Listener = (keys: string[]) => void

const listeners = new Set<Listener>()

export function announceAchievements(keys: string[] | undefined | null) {
  if (keys?.length) listeners.forEach((l) => l(keys))
}

export function onAchievements(l: Listener): () => void {
  listeners.add(l)
  return () => void listeners.delete(l)
}
