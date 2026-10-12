<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Application } from '@splinetool/runtime'
import { sendSignal } from '@/composables/usePreloader'

interface Props {
  scene: string
  class?: string
  /** Relay the cursor from anywhere on the page so the robot keeps looking at it. */
  followPointer?: boolean
}

const props = defineProps<Props>()
const canvas = ref<HTMLCanvasElement | null>(null)
const isLoaded = ref(false)
let app: Application | null = null
let rafFrame: number | null = null

// Spline only tracks pointers that hit its own canvas. We listen to `mousemove` on the
// document and re-dispatch it as `pointermove` on the canvas (different event types, so
// the relayed event never loops back). The page is mapped onto the canvas: horizontal
// follows the cursor fully, vertical stays in a gentle band so the robot never stares
// at the ceiling or the floor.
const relay = (e: MouseEvent) => {
  const c = canvas.value
  if (!c) return
  const rect = c.getBoundingClientRect()
  const x = rect.left + (e.clientX / window.innerWidth) * rect.width
  const y = rect.top + rect.height * (0.3 + 0.4 * (e.clientY / window.innerHeight))
  c.dispatchEvent(
    new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: 'mouse', isPrimary: true }),
  )
}

// Force WebGL clear-color to transparent on every frame.
// CSS `background: transparent` can't affect the WebGL clear-color —
// the only way is through the GL context itself.
const forceTransparentBg = (c: HTMLCanvasElement) => {
  const gl = c.getContext('webgl2', { alpha: true }) ?? c.getContext('webgl', { alpha: true })
  if (!gl) return
  const tick = () => { gl.clearColor(0, 0, 0, 0); rafFrame = requestAnimationFrame(tick) }
  rafFrame = requestAnimationFrame(tick)
}

onMounted(async () => {
  if (!canvas.value) return
  try {
    app = new Application(canvas.value)
    await app.load(props.scene)
    forceTransparentBg(canvas.value)
    isLoaded.value = true
    if (props.followPointer) document.addEventListener('mousemove', relay, { passive: true })
  } catch (e) {
    console.error('[SplineScene] failed to load scene', e)
  } finally {
    sendSignal('spline')
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', relay)
  if (rafFrame !== null) cancelAnimationFrame(rafFrame)
  app?.dispose()
})
</script>

<template>
  <div class="spline-wrapper" :class="props.class">
    <Transition name="fade">
      <div v-if="!isLoaded" class="spline-loader">
        <div class="loader" />
      </div>
    </Transition>
    <canvas ref="canvas" class="spline-canvas" />
  </div>
</template>

<style lang="scss" scoped>
.spline-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.spline-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.spline-canvas {
  width: 100%;
  height: 100%;
  display: block;
  background: transparent !important;
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.6s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }
</style>
