// Code sonification with the native Web Audio API (no samples, everything is synthesised).
//   swap   -> a low A-major chord
//   rotate -> a short mechanical tick with a thump
//   paint  -> a paint-brush splat: a filtered-noise swish, a wet pitch-drop "blop" and a soft thud; the blop's pitch
//             follows the color (a pentatonic scale, so a proof still sounds like a melody)
// Played from the timeline: auto playback, "Replay with sound" and the scrubber all go through playOp.
//
// Overlapping sounds (fast scrubbing, quick playback) are kept clean three ways:
//   - every sound is a "voice" with its own gain; at most MAX_VOICES play at once, and starting another steals the
//     oldest with a short fade-out, so there are no clicks and no pile-up;
//   - the same kind of sound is not re-triggered within DEBOUNCE_S of itself (a dragged slider fires many steps);
//   - everything goes through one master gain and a compressor, so even a dense burst cannot clip.

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

/** Peak gain of each part of each sound. swap and rotate are about twice as loud as they used to be. */
export const GAIN = {
  swapNote: 0.34, // was 0.16, three notes
  rotateClick: 0.3, // was 0.12
  rotateThump: 0.28, // was 0.1
  paintSwish: 0.4,
  paintBlop: 0.42,
  paintThud: 0.3,
} as const

export const MAX_VOICES = 6
export const DEBOUNCE_S = 0.03

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noise: AudioBuffer | null = null
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
  if (value) for (const v of [...voices]) v.stop() // silence whatever is still ringing
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

/** master gain -> compressor -> speakers, built once per context */
function output(c: AudioContext): GainNode {
  if (master) return master
  const comp = c.createDynamicsCompressor()
  comp.threshold.value = -14
  comp.knee.value = 18
  comp.ratio.value = 6
  comp.attack.value = 0.003
  comp.release.value = 0.15
  master = c.createGain()
  master.gain.value = 0.9
  master.connect(comp)
  comp.connect(c.destination)
  return master
}

function noiseBuffer(c: AudioContext): AudioBuffer {
  if (noise) return noise
  noise = c.createBuffer(1, Math.floor(c.sampleRate * 0.3), c.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return noise
}

// ---- voices ---------------------------------------------------------------------------------------------
interface Voice {
  out: GainNode
  endsAt: number
  sources: AudioScheduledSourceNode[]
  /** fade out quickly (no click) and release everything */
  stop: () => void
}
const voices: Voice[] = []
const lastPlayed: Record<string, number> = {}

/** Voices that are still sounding right now (for tests and debugging). */
export const activeVoices = () => (ctx ? voices.filter((v) => v.endsAt > ctx!.currentTime).length : 0)

function startVoice(c: AudioContext, lasts: number): Voice {
  // forget voices that finished, then make room by stealing the oldest ones
  for (let i = voices.length - 1; i >= 0; i--) if (voices[i].endsAt <= c.currentTime) voices.splice(i, 1)
  while (voices.length >= MAX_VOICES) voices.shift()!.stop()

  const out = c.createGain()
  out.connect(output(c))
  const voice: Voice = {
    out,
    endsAt: c.currentTime + lasts,
    sources: [],
    stop() {
      const now = c.currentTime
      out.gain.cancelScheduledValues(now)
      out.gain.setTargetAtTime(0, now, 0.008) // ~25 ms fade
      for (const s of voice.sources) {
        try {
          s.stop(now + 0.06)
        } catch {
          /* already stopped */
        }
      }
      voice.endsAt = 0
      const i = voices.indexOf(voice)
      if (i >= 0) voices.splice(i, 1)
      window.setTimeout(() => out.disconnect(), 120)
    },
  }
  voices.push(voice)
  return voice
}

/** One oscillator with an attack/decay envelope inside a voice (optionally panned). */
function tone(
  c: AudioContext,
  v: Voice,
  o: { hz: number; start: number; dur: number; gain: number; type: OscillatorType; bendTo?: number; pan?: number },
) {
  const osc = c.createOscillator()
  const amp = c.createGain()
  osc.type = o.type
  osc.frequency.setValueAtTime(o.hz, o.start)
  if (o.bendTo) osc.frequency.exponentialRampToValueAtTime(o.bendTo, o.start + o.dur * 0.8)
  amp.gain.setValueAtTime(0.0001, o.start)
  amp.gain.exponentialRampToValueAtTime(o.gain, o.start + 0.008)
  amp.gain.exponentialRampToValueAtTime(0.0001, o.start + o.dur)
  osc.connect(amp)
  connectPanned(c, amp, v.out, o.pan)
  osc.start(o.start)
  osc.stop(o.start + o.dur + 0.05)
  v.sources.push(osc)
}

function connectPanned(c: AudioContext, from: AudioNode, to: AudioNode, pan?: number) {
  if (pan !== undefined && c.createStereoPanner) {
    const p = c.createStereoPanner()
    p.pan.value = pan
    from.connect(p)
    p.connect(to)
  } else {
    from.connect(to)
  }
}

// ---- the three sounds --------------------------------------------------------------------------------------
function swapSound(c: AudioContext, v: Voice, t: number) {
  for (const hz of SWAP_CHORD_HZ) tone(c, v, { hz, start: t, dur: 0.5, gain: GAIN.swapNote, type: 'triangle' })
}

function rotateSound(c: AudioContext, v: Voice, t: number) {
  // a click (fast pitch drop on a square wave) plus a low thump
  tone(c, v, { hz: 2400, start: t, dur: 0.05, gain: GAIN.rotateClick, type: 'square', bendTo: 1100 })
  tone(c, v, { hz: 180, start: t, dur: 0.07, gain: GAIN.rotateThump, type: 'sine' })
}

function paintSound(c: AudioContext, v: Voice, t: number, color: string, x: number) {
  const hz = colorFrequency(color)
  // pan by column so a run of paints moves across the stereo field
  const pan = Math.max(-1, Math.min(1, (x - 1.5) / 1.5))

  // 1) the brush: a burst of noise whose band sweeps downwards
  const swish = c.createBufferSource()
  swish.buffer = noiseBuffer(c)
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.Q.value = 1.2
  band.frequency.setValueAtTime(3200, t)
  band.frequency.exponentialRampToValueAtTime(700, t + 0.17)
  const swishAmp = c.createGain()
  swishAmp.gain.setValueAtTime(0.0001, t)
  swishAmp.gain.exponentialRampToValueAtTime(GAIN.paintSwish, t + 0.02)
  swishAmp.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
  swish.connect(band)
  band.connect(swishAmp)
  connectPanned(c, swishAmp, v.out, pan)
  swish.start(t)
  swish.stop(t + 0.26)
  v.sources.push(swish)

  // 2) the wet splat: a sine that drops fast in pitch, tuned to the color
  tone(c, v, { hz: hz * 1.8, bendTo: hz * 0.55, start: t + 0.012, dur: 0.17, gain: GAIN.paintBlop, type: 'sine', pan })
  // 3) a soft thud as the paint lands
  tone(c, v, { hz: 95, bendTo: 55, start: t + 0.02, dur: 0.12, gain: GAIN.paintThud, type: 'sine' })
}

const LASTS = { swap: 0.56, rotate: 0.14, paint: 0.3 } as const

export function playOp(op: SoundOp) {
  if (muted) return
  const c = unlockAudio()
  if (!c) return
  // a dragged slider can fire dozens of steps a second: do not stack the same sound on itself
  if (c.currentTime - (lastPlayed[op.name] ?? -1) < DEBOUNCE_S) return
  lastPlayed[op.name] = c.currentTime

  const t = c.currentTime + 0.01
  const v = startVoice(c, LASTS[op.name])
  if (op.name === 'swap') swapSound(c, v, t)
  else if (op.name === 'rotate') rotateSound(c, v, t)
  else paintSound(c, v, t, op.args[2], Number(op.args[0]))
}
