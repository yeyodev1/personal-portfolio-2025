import { onMounted } from 'vue'

// Drives the #boot loading screen that lives in index.html. It is plain DOM on purpose:
// it is visible before Vue boots, so the visitor never sees a blank or black page.

export type PreloadTheme = 'arcade' | 'classic' | 'muro' | 'mundo' | 'plain'

const MIN_VISIBLE_MS = 700
const MAX_WAIT_MS = 12000

const boot = () => document.getElementById('boot')

function show(theme: PreloadTheme) {
  const el = boot()
  if (!el) return
  el.dataset.theme = theme
  el.classList.remove('boot--done')
  el.style.display = ''
  setProgress(0)
}

function setProgress(ratio: number) {
  const el = boot()
  if (!el) return
  const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 100)
  el.style.setProperty('--boot-progress', `${pct}%`)
  const label = el.querySelector<HTMLElement>('[data-boot-pct]')
  if (label) label.textContent = `${pct}%`
}

/** Hide the loading screen (also used by routes that have nothing heavy to wait for). */
export function hidePreloader() {
  const el = boot()
  if (!el || el.classList.contains('boot--done')) return
  setProgress(1)
  el.classList.add('boot--done')
  window.setTimeout(() => {
    if (el.classList.contains('boot--done')) el.style.display = 'none'
  }, 500)
}

// Components deep in the tree (e.g. the Spline robot) announce when they are ready.
const signals = new Map<string, { promise: Promise<void>; resolve: () => void }>()
const signal = (name: string) => {
  if (!signals.has(name)) {
    let resolve!: () => void
    const promise = new Promise<void>((r) => (resolve = r))
    signals.set(name, { promise, resolve })
  }
  return signals.get(name)!
}
export const waitForSignal = (name: string) => signal(name).promise
export const sendSignal = (name: string) => signal(name).resolve()
export const resetSignal = (name: string) => signals.delete(name)

export function preloadImages(urls: string[]) {
  return urls.map(
    (url) =>
      new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = img.onerror = () => resolve()
        img.src = url
      }),
  )
}

export function preloadFonts(families: string[]) {
  if (!document.fonts) return [Promise.resolve()]
  return families.map((f) => document.fonts.load(`1em "${f}"`).then(() => undefined, () => undefined))
}

/**
 * Show the loading screen for this page until every task settles (or the safety timeout).
 * Tasks can be added during setup or in onMounted; `track` reports partial progress of a task.
 */
export function usePagePreload(theme: PreloadTheme) {
  const started = performance.now()
  const tasks: Promise<unknown>[] = []
  const partial = new Map<number, number>()
  let settled = 0

  show(theme)

  const refresh = () => {
    const extra = [...partial.values()].reduce((a, b) => a + b, 0)
    setProgress(tasks.length ? (settled + extra) / tasks.length : 0)
  }

  const add = (...promises: Promise<unknown>[]) => {
    for (const p of promises) {
      const index = tasks.length
      tasks.push(
        p.catch(() => undefined).finally(() => {
          partial.delete(index)
          settled++
          refresh()
        }),
      )
    }
    return tasks.length - 1
  }

  /** Report fine-grained progress (0–1) for the task at `index`, e.g. a 3D model download. */
  const track = (index: number, ratio: number) => {
    partial.set(index, Math.min(0.99, ratio))
    refresh()
  }

  onMounted(async () => {
    // Give components a tick to register their own tasks.
    await Promise.resolve()
    const timeout = new Promise((r) => window.setTimeout(r, MAX_WAIT_MS))
    await Promise.race([Promise.allSettled(tasks), timeout])
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started))
    window.setTimeout(hidePreloader, wait)
  })

  return { add, track }
}
