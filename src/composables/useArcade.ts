import { ref } from 'vue'

// Tiny synthesized chiptune blips, so the game screens need no audio files.
export type Version = 'clasica' | 'muro' | 'mundo'

const LAST_KEY = 'yeyo:last-version'
const SOUND_KEY = 'yeyo:sound'

const soundOn = ref(true)
let ctx: AudioContext | null = null

try {
  soundOn.value = localStorage.getItem(SOUND_KEY) !== 'off'
} catch {
  /* storage unavailable: keep default */
}

const audio = () => {
  if (!soundOn.value) return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

const tone = (freq: number, start: number, dur: number, type: OscillatorType = 'square', vol = 0.05) => {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  const t = ac.currentTime + start
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + dur)
}

export function useArcade() {
  const blip = () => tone(660, 0, 0.07)
  const select = () => {
    tone(523, 0, 0.08)
    tone(784, 0.07, 0.12)
  }
  const start = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.18))
  const talk = () => tone(320 + Math.random() * 120, 0, 0.04, 'triangle', 0.04)
  const deliver = () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.2, 'triangle', 0.06))
  const step = () => tone(110, 0, 0.05, 'triangle', 0.025)

  const toggleSound = () => {
    soundOn.value = !soundOn.value
    try {
      localStorage.setItem(SOUND_KEY, soundOn.value ? 'on' : 'off')
    } catch {
      /* ignore */
    }
  }

  const lastVersion = (): Version | null => {
    try {
      return localStorage.getItem(LAST_KEY) as Version | null
    } catch {
      return null
    }
  }

  const rememberVersion = (v: Version) => {
    try {
      localStorage.setItem(LAST_KEY, v)
    } catch {
      /* ignore */
    }
  }

  return { soundOn, toggleSound, blip, select, start, talk, deliver, step, lastVersion, rememberVersion }
}
