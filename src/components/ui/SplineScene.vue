<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Application } from '@splinetool/runtime'
import { sendSignal } from '@/composables/usePreloader'

interface Props {
  scene: string
  class?: string
}

const props = defineProps<Props>()
const canvas = ref<HTMLCanvasElement | null>(null)
const isLoaded = ref(false)
let app: Application | null = null
let rafFrame: number | null = null

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
  } catch (e) {
    console.error('[SplineScene] failed to load scene', e)
  } finally {
    sendSignal('spline')
  }
})

onUnmounted(() => {
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
