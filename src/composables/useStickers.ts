import { ref, type Directive } from 'vue'

// Each draggable sticker keeps its own offset; `tidyUp` sends every one home.
interface StickerState {
  x: number
  y: number
  rotate: number
}

const stickers = new Map<HTMLElement, StickerState>()
const movedCount = ref(0)
let topZ = 10

const apply = (el: HTMLElement, s: StickerState, extraRotate = 0) => {
  el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rotate + extraRotate}deg)`
}

export const vSticker: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const state: StickerState = { x: 0, y: 0, rotate: binding.value ?? 0 }
    stickers.set(el, state)
    el.dataset.sticker = ''
    apply(el, state)

    let startX = 0
    let startY = 0
    let originX = 0
    let originY = 0
    let moved = false

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!moved && Math.hypot(dx, dy) < 4) return
      if (!moved) movedCount.value++
      moved = true
      state.x = originX + dx
      state.y = originY + dy
      apply(el, state, Math.max(-8, Math.min(8, dx / 25)))
    }

    const onUp = () => {
      el.classList.remove('is-dragging')
      apply(el, state)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return
      startX = e.clientX
      startY = e.clientY
      originX = state.x
      originY = state.y
      moved = false
      el.classList.add('is-dragging')
      el.style.zIndex = String(++topZ)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    })

    // A drag should never follow the link the sticker may wrap.
    el.addEventListener(
      'click',
      (e) => {
        if (moved) {
          e.preventDefault()
          e.stopPropagation()
        }
      },
      true,
    )
  },
  unmounted(el) {
    stickers.delete(el)
  },
}

export function useStickers() {
  const tidyUp = () => {
    stickers.forEach((s, el) => {
      s.x = 0
      s.y = 0
      apply(el, s)
    })
    movedCount.value = 0
  }

  return { tidyUp, movedCount }
}
