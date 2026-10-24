// Code sonification with the native Web Audio API (no samples, everything is synthesised).
//   swap   -> a low A-major chord
//   rotate -> a short mechanical tick
//   paint  -> a chime whose pitch depends on the color (a pentatonic scale, so a proof sounds like a melody)
// Played from the timeline: auto playback, "Replay with sound" and the scrubber all go through playOp.

export interface SoundOp {
  name: 'swap' | 'paint' | 'rotate'
  args: string[]
}

const MUTE_KEY = 'pp_muted'

/** Pentatonic C D E G A, so any sequence of paints is consonant. */
export const COLOR_HZ: Record<string, number> = {
  blue: 523.25, // C5
  green: 587.33, // D5
  red: 659.25, // E5
  yellow: 783.99, // G5
  purple: 880.0, // A5
}
export const colorFrequency = (color: string) => COLOR_HZ[color] ?? 440

/** A2, C#3, E3 */
export const SWAP_CHORD_HZ = [110, 138.59, 164.81]

let ctx: AudioContext | null = null
let muted = (() => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
})()

export const isMuted = () => muted
export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0')
  } catch {
    /* ignore */
  }
}

/** Creates (or resumes) the audio context. Browsers only allow this inside a user gesture such as a click. */
export function unlockAudio(): AudioContext | null {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx ??= new Ctor()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** One oscillator with an attack/decay envelope, routed to the output (optionally panned). */
function tone(c: AudioContext, opts: { hz: number; start: number; dur: number; gain: number; type: OscillatorType; bendTo?: number; pan?: number }) {
  const osc = c.createOscillator()
  const amp = c.createGain()
  osc.type = opts.type
  osc.frequency.setValueAtTime(opts.hz, opts.start)
  if (opts.bendTo) osc.frequency.exponentialRampToValueAtTime(opts.bendTo, opts.start + opts.dur * 0.6)
  amp.gain.setValueAtTime(0.0001, opts.start)
  amp.gain.exponentialRampToValueAtTime(opts.gain, opts.start + 0.008)
  amp.gain.exponentialRampToValueAtTime(0.0001, opts.start + opts.dur)
  osc.connect(amp)
  if (opts.pan !== undefined && c.createStereoPanner) {
    const p = c.createStereoPanner()
    p.pan.value = opts.pan
    amp.connect(p).connect(c.destination)
  } else {
    amp.connect(c.destination)
  }
  osc.start(opts.start)
  osc.stop(opts.start + opts.dur + 0.05)
}

function swapSound(c: AudioContext, t: number) {
  for (const hz of SWAP_CHORD_HZ) tone(c, { hz, start: t, dur: 0.5, gain: 0.16, type: 'triangle' })
}

function rotateSound(c: AudioContext, t: number) {
  // a click (fast pitch drop on a square wave) plus a tiny low thump
  tone(c, { hz: 2400, start: t, dur: 0.04, gain: 0.12, type: 'square', bendTo: 1100 })
  tone(c, { hz: 180, start: t, dur: 0.05, gain: 0.1, type: 'sine' })
}

function paintSound(c: AudioContext, t: number, color: string, x: number) {
  const hz = colorFrequency(color)
  // pan by column so the melody moves across the stereo field; a slight upward glide gives the chime its "ping"
  const pan = Math.max(-1, Math.min(1, (x - 1.5) / 1.5))
  tone(c, { hz, start: t, dur: 0.7, gain: 0.18, type: 'sine', bendTo: hz * 1.004, pan })
  tone(c, { hz: hz * 2, start: t, dur: 0.45, gain: 0.07, type: 'sine', pan })
  tone(c, { hz: hz * 3, start: t, dur: 0.25, gain: 0.03, type: 'sine', pan })
}

export function playOp(op: SoundOp) {
  if (muted) return
  const c = unlockAudio()
  if (!c) return
  const t = c.currentTime + 0.01
  if (op.name === 'swap') swapSound(c, t)
  else if (op.name === 'rotate') rotateSound(c, t)
  else paintSound(c, t, op.args[2], Number(op.args[0]))
}
