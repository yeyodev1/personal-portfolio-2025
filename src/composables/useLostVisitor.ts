import { onBeforeUnmount, onMounted, ref } from 'vue'

// Notices when a visitor seems unsure what to do: nothing meaningful happens for a
// while, or they keep clicking on things that aren't interactive.
// Clicks on the 3D canvas count as misses: tapping without dragging means the player doesn't know how to move.
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="option"], [tabindex]'

export function useLostVisitor(options: { idleMs?: number; lostClicks?: number; enabled?: () => boolean } = {}) {
  const { idleMs = 7000, lostClicks = 3, enabled = () => true } = options
  const lost = ref(false)
  let timer = 0
  let misses: number[] = []

  const arm = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      // Not the right moment (an intro, a dialog…): keep watching instead of giving up.
      if (enabled()) lost.value = true
      else arm()
    }, idleMs)
  }

  /** Something purposeful happened: the visitor knows what they're doing. */
  const progress = () => {
    misses = []
    arm()
  }

  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement | null
    if (target?.closest(INTERACTIVE)) return progress()
    const now = Date.now()
    misses = [...misses.filter((t) => now - t < 6000), now]
    if (misses.length >= lostClicks && enabled()) lost.value = true
  }

  const onKey = () => progress()

  onMounted(() => {
    arm()
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
  })

  onBeforeUnmount(() => {
    window.clearTimeout(timer)
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('keydown', onKey)
  })

  const dismiss = () => {
    lost.value = false
    progress()
  }

  return { lost, progress, dismiss, rearm: arm }
}
