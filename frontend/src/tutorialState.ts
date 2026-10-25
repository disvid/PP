// Remembers (per player, in this browser) that the tutorial has been shown, so it pops up by itself only once.
import { session } from './api'

const key = (name: string | null) => `pp_tutorial_seen:${name ?? ''}`

export function hasSeenTutorial(name: string | null = session.name()): boolean {
  try {
    return localStorage.getItem(key(name)) === '1'
  } catch {
    return true // storage unavailable: never nag
  }
}

export function markTutorialSeen(name: string | null = session.name()) {
  try {
    localStorage.setItem(key(name), '1')
  } catch {
    /* it will just be shown again */
  }
}
