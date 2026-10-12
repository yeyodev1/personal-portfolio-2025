<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useArcade } from '@/composables/useArcade'
import { useLanguage } from '@/composables/useLanguage'
import { WorldEngine, type NpcId } from './engine'
import LeadForm from '@/components/shared/LeadForm.vue'
import ProjectsExplorer from '@/components/shared/ProjectsExplorer.vue'
import CdnImg from '@/components/shared/CdnImg.vue'
import { useLostVisitor } from '@/composables/useLostVisitor'
import { preloadFonts, preloadImages, usePagePreload } from '@/composables/usePreloader'
import { cdn } from '@/data/cdn'

type Speaker = NpcId | 'yeyo'

const { t, tm } = useI18n()
const { isEs, toggle } = useLanguage()
const { soundOn, toggleSound, talk, deliver, select, start, step } = useArcade()

const canvas = ref<HTMLCanvasElement>()

// The loading screen stays until the planet art and the 3D Yeyo are ready, so the
// intro never flashes an empty canvas.
const preload = usePagePreload('mundo')
preload.add(
  ...preloadFonts(['Bungee', 'Permanent Marker', 'Instrument Sans']),
  ...preloadImages([cdn('/game/intro.jpg', 900), cdn('/game/yeyo.jpg', 160)]),
)
let modelLoaded!: () => void
const modelTask = preload.add(new Promise<void>((resolve) => (modelLoaded = resolve)))
const engine = shallowRef<WorldEngine>()
const phase = ref<'intro' | 'play'>('intro')
const progress = ref(0)
const ready = computed(() => progress.value >= 1)
const near = ref<NpcId | null>(null)
const showText = ref(false)
const panel = ref<'form' | 'projects' | null>(null)
const hasMoved = ref(false)
const isTouch = ref(false)

const QUEST: NpcId[] = ['bakano', 'pastry', 'dental', 'robot']
const delivered = reactive(new Set<NpcId>())
const allDelivered = computed(() => QUEST.every((id) => delivered.has(id)))

const portraits: Record<Speaker, string> = {
  yeyo: '/game/yeyo.jpg',
  bakano: '/game/bakano.jpg',
  pastry: '/game/pastry.jpg',
  dental: '/game/dental.jpg',
  robot: '/game/robot.jpg',
  mailbox: '/game/yeyo.jpg',
  gallery: '/game/yeyo.jpg',
}

// ── dialog ────────────────────────────────────────────────────────────────
const dialog = reactive({ open: false, who: 'yeyo' as Speaker, line: 0, shown: '' })
let typer = 0
const lines = computed(() => tm(`world.npcs.${dialog.who}.lines`) as string[])
const fullLine = computed(() => lines.value[dialog.line] ?? '')
const isLast = computed(() => dialog.line >= lines.value.length - 1)
const linkOf = (id: Speaker) => (id === 'yeyo' ? '' : ((tm(`world.npcs.${id}`) as { link?: string }).link ?? ''))
const link = computed(() => linkOf(dialog.who))
const typing = computed(() => dialog.shown.length < fullLine.value.length)

const typeLine = () => {
  window.clearInterval(typer)
  dialog.shown = ''
  let i = 0
  typer = window.setInterval(() => {
    i++
    dialog.shown = fullLine.value.slice(0, i)
    if (i % 3 === 0) talk()
    if (i >= fullLine.value.length) window.clearInterval(typer)
  }, 22)
}

const openDialog = (who: Speaker) => {
  dialog.who = who
  dialog.line = 0
  dialog.open = true
  if (engine.value) engine.value.paused = true
  select()
  typeLine()
}

const advance = () => {
  if (typing.value) {
    window.clearInterval(typer)
    dialog.shown = fullLine.value
    return
  }
  if (!isLast.value) {
    dialog.line++
    typeLine()
    return
  }
  closeDialog()
}

const closeDialog = () => {
  window.clearInterval(typer)
  dialog.open = false
  const who = dialog.who
  if (QUEST.includes(who as NpcId) && !delivered.has(who as NpcId)) {
    delivered.add(who as NpcId)
    engine.value?.setDelivered(who as NpcId)
    deliver()
  }
  if (engine.value) engine.value.paused = false
}

const openPanel = (which: 'form' | 'projects') => {
  closeDialog()
  showText.value = false
  panel.value = which
  if (engine.value) engine.value.paused = true
  select()
}

const closePanel = () => {
  panel.value = null
  if (engine.value) engine.value.paused = false
}

const interact = () => {
  if (dialog.open) advance()
  else if (near.value && phase.value === 'play') openDialog(near.value)
}

// ── guidance: compass to the next character + coach when the player looks lost ──
const nextTarget = computed<NpcId>(() => QUEST.find((id) => !delivered.has(id)) ?? 'mailbox')
const compass = reactive({ angle: 0, dist: 0, show: false })
let compassTimer = 0
const updateCompass = () => {
  const b = engine.value?.bearingTo(nextTarget.value)
  if (!b) return
  compass.angle = b.angle
  compass.dist = Math.round(b.dist)
  compass.show = phase.value === 'play' && !dialog.open && !panel.value && near.value !== nextTarget.value
}

const coach = ref(false)
let coachShown = 0
const { lost, dismiss: dismissLost, progress: markProgress } = useLostVisitor({
  idleMs: 7000,
  enabled: () => phase.value === 'play' && !dialog.open && !panel.value && !showText.value && coachShown < 2,
})
watch(lost, (isLost) => {
  if (!isLost) return
  coachShown++
  coach.value = true
  if (engine.value) engine.value.paused = true
})
const closeCoach = () => {
  coach.value = false
  dismissLost()
  if (engine.value) engine.value.paused = false
}
const coachToText = () => {
  closeCoach()
  showText.value = true
}

// ── input ─────────────────────────────────────────────────────────────────
const keys = new Set<string>()
const syncKeys = () => {
  if (!engine.value) return
  const x = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0)
  const y = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0)
  engine.value.input.x = x
  engine.value.input.y = y
  if (x || y) {
    hasMoved.value = true
    markProgress()
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  const k = e.key.toLowerCase()
  if (coach.value) {
    if (['escape', 'enter', ' '].includes(k)) {
      e.preventDefault()
      closeCoach()
    }
    return
  }
  if (k === 'escape' && (panel.value || showText.value)) {
    if (panel.value) closePanel()
    showText.value = false
    return
  }
  // While a panel is open (or the user types in a field) the game keys must stay out of the way.
  const typing = e.target instanceof Element && !!e.target.closest('input, textarea, select')
  if (panel.value || showText.value || typing) return
  if (['e', 'enter', ' '].includes(k)) {
    e.preventDefault()
    if (phase.value === 'intro') begin()
    else interact()
    return
  }
  if (k === 'escape' && dialog.open) return closeDialog()
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
    e.preventDefault()
    keys.add(k)
    syncKeys()
  }
}
const onKeyUp = (e: KeyboardEvent) => {
  keys.delete(e.key.toLowerCase())
  syncKeys()
}

const stick = reactive({ active: false, ox: 0, oy: 0, dx: 0, dy: 0, id: -1 })
const STICK_R = 55
const onPointerDown = (e: PointerEvent) => {
  if (phase.value !== 'play' || dialog.open || e.pointerType === 'mouse') return
  isTouch.value = true
  Object.assign(stick, { active: true, ox: e.clientX, oy: e.clientY, dx: 0, dy: 0, id: e.pointerId })
}
const onPointerMove = (e: PointerEvent) => {
  if (!stick.active || e.pointerId !== stick.id || !engine.value) return
  let dx = e.clientX - stick.ox
  let dy = e.clientY - stick.oy
  const len = Math.hypot(dx, dy)
  if (len > STICK_R) {
    dx = (dx / len) * STICK_R
    dy = (dy / len) * STICK_R
  }
  stick.dx = dx
  stick.dy = dy
  engine.value.input.x = dx / STICK_R
  engine.value.input.y = -dy / STICK_R
  hasMoved.value = true
  markProgress()
}
const onPointerUp = (e: PointerEvent) => {
  if (e.pointerId !== stick.id) return
  stick.active = false
  if (engine.value) engine.value.input.x = engine.value.input.y = 0
}

// ── lifecycle ─────────────────────────────────────────────────────────────
const begin = () => {
  if (!ready.value || phase.value !== 'intro') return
  start()
  phase.value = 'play'
  window.setTimeout(() => openDialog('yeyo'), 700)
}

const onResize = () => engine.value?.resize()

onMounted(async () => {
  isTouch.value = window.matchMedia('(hover: none)').matches
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('resize', onResize)
  await document.fonts?.ready
  engine.value = new WorldEngine(canvas.value!, {
    onProgress: (r) => {
      progress.value = r
      preload.track(modelTask, r)
    },
    onNear: (id) => (near.value = id),
    onStep: step,
  })
  if (import.meta.env.DEV) Object.assign(window, { __world: engine.value })
  compassTimer = window.setInterval(updateCompass, 120)
  try {
    await engine.value.load('/game/yeyo.glb')
  } finally {
    // One painted frame before revealing, so the canvas is never black.
    requestAnimationFrame(() => modelLoaded())
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('resize', onResize)
  window.clearInterval(typer)
  window.clearInterval(compassTimer)
  engine.value?.dispose()
})

const allNpcs: Speaker[] = ['yeyo', 'bakano', 'pastry', 'dental', 'robot', 'gallery', 'mailbox']
</script>

<template>
  <div class="world" :class="`world--${phase}`">
    <canvas
      ref="canvas"
      class="world__canvas"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    />

    <!-- Intro / title screen -->
    <Transition name="fade">
      <section v-if="phase === 'intro'" class="intro">
        <CdnImg src="/game/intro.jpg" :width="900" class="intro__planet" eager />
        <h1 class="intro__title" aria-label="YEYO.DEV">
          <span>YEYO</span><span>.DEV</span>
        </h1>
        <p class="intro__sub">{{ t('world.subtitle') }}</p>
        <button class="intro__begin" :disabled="!ready" @click="begin">
          <template v-if="ready">{{ t('world.begin') }}</template>
          <template v-else><i class="fa-solid fa-envelope fa-bounce" aria-hidden="true" /> {{ t('world.loading') }} {{ Math.round(progress * 100) }}%</template>
        </button>
      </section>
    </Transition>

    <!-- HUD -->
    <template v-if="phase === 'play'">
      <div class="hud hud--quest">
        <span class="hud__label">{{ t('world.questTitle') }}</span>
        <span class="hud__letters">
          <i v-for="id in QUEST" :key="id" class="fa-solid" :class="[delivered.has(id) ? 'fa-envelope-circle-check on' : 'fa-envelope']" aria-hidden="true" />
          <b>{{ delivered.size }}/{{ QUEST.length }}</b>
        </span>
        <span v-if="allDelivered" class="hud__done">{{ t('world.questDone') }}</span>
      </div>

      <div class="hud hud--tools">
        <button @click="toggleSound" :aria-label="t('world.sound')"><i :class="soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'" /></button>
        <button @click="showText = true" :aria-label="t('world.skip')"><i class="fa-solid fa-scroll" style="color: #b3842a" /></button>
        <button @click="toggle">{{ isEs ? 'EN' : 'ES' }}</button>
      </div>

      <Transition name="fade">
        <p v-if="!hasMoved && !dialog.open" class="hud hud--controls">
          {{ isTouch ? t('world.controlsTouch') : t('world.controls') }}
        </p>
      </Transition>

      <Transition name="pop">
        <button v-if="near && !dialog.open" class="talk" @click="interact">
          <kbd v-if="!isTouch">E</kbd> {{ t('world.talk') }} · {{ t(`world.npcs.${near}.name`) }}
        </button>
      </Transition>

      <Transition name="fade">
        <div v-if="compass.show" class="compass" :class="{ 'compass--lost': coachShown > 0 }" aria-live="polite">
          <span class="compass__arrow" :style="{ transform: `rotate(${compass.angle}deg)` }">
            <i class="fa-solid fa-location-arrow" aria-hidden="true" />
          </span>
          <span class="compass__text">
            {{ t('world.guide.arrow', { name: t(`world.npcs.${nextTarget}.name`) }) }}
            <small>{{ compass.dist }} m</small>
          </span>
        </div>
      </Transition>

      <div v-if="stick.active" class="stick" :style="{ left: `${stick.ox}px`, top: `${stick.oy}px` }">
        <span :style="{ transform: `translate(${stick.dx}px, ${stick.dy}px)` }" />
      </div>
    </template>

    <!-- Coach for players who look lost -->
    <Transition name="fade">
      <div v-if="coach" class="coach" role="dialog" :aria-label="t('world.guide.title')" @click.self="closeCoach">
        <div class="coach__card">
          <CdnImg src="/game/yeyo.jpg" :width="80" class="coach__avatar" />
          <h2>{{ t('world.guide.title') }}</h2>
          <div v-if="!isTouch" class="coach__keys" aria-hidden="true">
            <span class="k k--w">W</span>
            <span class="k k--a">A</span><span class="k k--s">S</span><span class="k k--d">D</span>
          </div>
          <div v-else class="coach__finger" aria-hidden="true">
            <span class="coach__ring" /><i class="fa-solid fa-hand-pointer" />
          </div>
          <p>{{ isTouch ? t('world.guide.touch') : t('world.guide.keys') }}</p>
          <p class="coach__follow">
            <i class="fa-solid fa-location-arrow" aria-hidden="true" /> {{ t('world.guide.follow') }}
          </p>
          <div class="coach__actions">
            <button class="dialog__btn dialog__btn--link" @click="closeCoach"><i class="fa-solid fa-check" aria-hidden="true" /> {{ t('world.guide.ok') }}</button>
            <button class="coach__text" @click="coachToText">{{ t('world.guide.text') }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Dialog box -->
    <Transition name="dialog">
      <div v-if="dialog.open" class="dialog" @click="advance">
        <CdnImg :key="dialog.who" :src="portraits[dialog.who]" :width="160" class="dialog__portrait" eager />
        <div class="dialog__box">
          <p class="dialog__name">
            {{ t(`world.npcs.${dialog.who}.name`) }}
            <span>{{ t(`world.npcs.${dialog.who}.role`) }}</span>
          </p>
          <p class="dialog__text">{{ dialog.shown }}<i v-if="typing" class="dialog__caret" /></p>
          <div class="dialog__actions" @click.stop>
            <button v-if="isLast && !typing && dialog.who === 'mailbox'" class="dialog__btn dialog__btn--form" @click="openPanel('form')">
              <i class="fa-solid fa-envelope-open-text" aria-hidden="true" /> {{ t('world.npcs.mailbox.form') }}
            </button>
            <button v-if="isLast && !typing && dialog.who === 'gallery'" class="dialog__btn dialog__btn--form" @click="openPanel('projects')">
              <i class="fa-solid fa-star" aria-hidden="true" /> {{ t('world.npcs.gallery.open') }}
            </button>
            <a v-if="isLast && !typing && link" :href="link" target="_blank" rel="noopener noreferrer" class="dialog__btn dialog__btn--link">
              <i :class="dialog.who === 'mailbox' ? 'fa-brands fa-whatsapp' : 'fa-solid fa-arrow-up-right-from-square'" aria-hidden="true" /> {{ dialog.who === 'mailbox' ? t('world.npcs.mailbox.cta') : t('world.visit') }}
            </a>
            <button class="dialog__btn" @click="advance">
              {{ isLast && !typing ? t('world.close') : t('world.next') }} ▶
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Form / projects panels -->
    <Transition name="fade">
      <div v-if="panel" class="textmode" role="dialog" :aria-label="panel === 'form' ? t('world.formTitle') : t('world.projectsTitle')" @click.self="closePanel">
        <div class="textmode__panel" :class="{ 'textmode__panel--wide': panel === 'projects' }">
          <button class="textmode__close" :aria-label="t('world.close')" @click="closePanel"><i class="fa-solid fa-xmark" /></button>
          <h2>{{ panel === 'form' ? t('world.formTitle') : t('world.projectsTitle') }}</h2>
          <LeadForm v-if="panel === 'form'" source="mundo" theme="game" compact />
          <ProjectsExplorer v-else theme="game" :initial="6" />
        </div>
      </div>
    </Transition>

    <!-- Text mode -->
    <Transition name="fade">
      <div v-if="showText" class="textmode" role="dialog" :aria-label="t('world.textMode')">
        <div class="textmode__panel">
          <button class="textmode__close" :aria-label="t('world.close')" @click="showText = false"><i class="fa-solid fa-xmark" /></button>
          <h2>{{ t('world.textMode') }}</h2>
          <div class="textmode__shortcuts">
            <button class="dialog__btn dialog__btn--form" @click="openPanel('form')"><i class="fa-solid fa-envelope-open-text" aria-hidden="true" /> {{ t('world.npcs.mailbox.form') }}</button>
            <button class="dialog__btn" @click="openPanel('projects')"><i class="fa-solid fa-star" style="color: #ffe14d" aria-hidden="true" /> {{ t('world.npcs.gallery.open') }}</button>
          </div>
          <article v-for="id in allNpcs" :key="id" class="textmode__item">
            <CdnImg :src="portraits[id]" :width="72" />
            <div>
              <h3>{{ t(`world.npcs.${id}.name`) }} <span>{{ t(`world.npcs.${id}.role`) }}</span></h3>
              <p v-for="(line, i) in (tm(`world.npcs.${id}.lines`) as string[])" :key="i">{{ line }}</p>
              <a v-if="linkOf(id)" :href="linkOf(id)" target="_blank" rel="noopener noreferrer">
                {{ id === 'mailbox' ? t('world.npcs.mailbox.cta') : t('world.visit') }} ↗
              </a>
            </div>
          </article>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');

$teal: #469eaa;
$ink: #1f2a2c;
$cream: #f4efe1;

.world {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #8fd6cc;
  font-family: $font-body;
  color: $ink;
  user-select: none;

  &__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
  }
}

// ── intro ──────────────────────────────────────────────────────────────────
.intro {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: $teal;
  display: grid;
  place-items: center;
  grid-template-rows: 1fr auto auto;
  padding: 1rem 1rem 5.5rem;

  &__planet {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(92vw, 92vh, 860px);
    transform: translate(-50%, -54%);
    animation: float 6s ease-in-out infinite;
  }

  &__title {
    position: relative;
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Bungee', 'Bowlby One', sans-serif;
    font-size: clamp(3.5rem, 15vw, 9rem);
    line-height: 0.92;
    color: $cream;
    -webkit-text-stroke: 3px $ink;
    paint-order: stroke fill;
    text-shadow:
      2px 2px 0 #c8c0a9, 4px 4px 0 #c8c0a9, 6px 6px 0 #b7ae95, 8px 8px 0 $ink;
    transform: rotate(-3deg);
  }

  &__sub {
    position: relative;
    font-family: 'Permanent Marker', cursive;
    font-size: 1.3rem;
    color: $cream;
    text-shadow: 2px 2px 0 $ink;
    margin-bottom: 1.25rem;
  }

  &__begin {
    position: relative;
    font-family: 'Bungee', sans-serif;
    font-size: 1.35rem;
    letter-spacing: 0.05em;
    color: $cream;
    -webkit-text-stroke: 1px $ink;
    background: #e9b949;
    border: 3px solid $ink;
    padding: 0.7rem 2.2rem;
    transform: skew(-4deg) rotate(-1deg);
    box-shadow: 0 7px 0 #b3842a, 0 7px 0 3px $ink;
    cursor: pointer;
    transition: transform 0.15s ease;

    &:hover:not(:disabled) { transform: skew(-4deg) rotate(-1deg) translateY(-3px); }
    &:active:not(:disabled) { transform: skew(-4deg) translateY(5px); box-shadow: 0 2px 0 #b3842a, 0 2px 0 3px $ink; }
    &:disabled { font-size: 0.95rem; opacity: 0.85; cursor: progress; }
  }
}

// ── HUD ────────────────────────────────────────────────────────────────────
.hud {
  position: absolute;
  z-index: 10;
  background: $cream;
  border: 3px solid $ink;
  border-radius: 10px;
  box-shadow: 4px 4px 0 $ink;

  &--quest {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-width: min(280px, 60vw);
    transform: rotate(-1.5deg);
  }

  &__label { font-family: $font-mono; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; }

  &__letters {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 1.3rem;

    i { opacity: 0.3; color: #1f2a2c; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
    i.on { opacity: 1; color: #10b981; transform: rotate(-8deg) scale(1.15); }
    b { font-family: 'Bungee', sans-serif; font-size: 0.95rem; margin-left: 0.3rem; }
  }

  &__done { font-family: 'Permanent Marker', cursive; font-size: 0.95rem; color: #c2410c; }

  &--tools {
    top: 1rem;
    right: 1rem;
    display: flex;
    overflow: hidden;

    button {
      width: 2.7rem;
      height: 2.7rem;
      font-size: 1rem;
      border: none;
      background: transparent;
      font-family: $font-mono;
      font-weight: 500;
      cursor: pointer;
      & + button { border-left: 3px solid $ink; }
      &:hover { background: #ffe14d; }
    }
  }

  &--controls {
    left: 50%;
    bottom: 4.5rem;
    transform: translateX(-50%);
    padding: 0.5rem 1rem;
    font-family: $font-mono;
    font-size: 0.75rem;
    white-space: nowrap;
  }
}

.talk {
  position: absolute;
  left: 50%;
  bottom: 4.5rem;
  z-index: 11;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.2rem;
  background: #ffe14d;
  border: 3px solid $ink;
  border-radius: 999px;
  box-shadow: 0 5px 0 $ink;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  animation: nudge 1.4s ease-in-out infinite;

  kbd {
    font-family: 'Bungee', sans-serif;
    background: $ink;
    color: #ffe14d;
    border-radius: 6px;
    padding: 0.1rem 0.45rem;
  }
}

.stick {
  position: absolute;
  z-index: 12;
  width: 110px;
  height: 110px;
  margin: -55px 0 0 -55px;
  border-radius: 50%;
  border: 3px solid rgba(31, 42, 44, 0.5);
  background: rgba(244, 239, 225, 0.35);
  pointer-events: none;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 46px;
    height: 46px;
    margin: -23px 0 0 -23px;
    border-radius: 50%;
    background: $cream;
    border: 3px solid $ink;
  }
}

// ── guidance ───────────────────────────────────────────────────────────────
.compass {
  position: absolute;
  top: 5.4rem;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem 0.4rem 0.4rem;
  background: $cream;
  border: 3px solid $ink;
  border-radius: 999px;
  box-shadow: 3px 3px 0 $ink;
  white-space: nowrap;

  @media (min-width: 700px) { top: 1rem; }

  &__arrow {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: #ffe14d;
    border: 2px solid $ink;
    transition: transform 0.15s linear;

    // fa-location-arrow points up-right by default; rotate it to point straight up.
    i { transform: rotate(-45deg); color: $ink; }
  }

  &__text {
    font-weight: 700;
    font-size: 0.9rem;
    small { margin-left: 0.35rem; font-family: $font-mono; font-weight: 500; opacity: 0.6; }
  }

  &--lost &__arrow { animation: pulse-ring 1.2s ease-in-out infinite; }
}

.coach {
  position: absolute;
  inset: 0;
  z-index: 25;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(31, 42, 44, 0.45);

  &__card {
    width: min(420px, 100%);
    text-align: center;
    background: $cream;
    border: 3px solid $ink;
    border-radius: 18px;
    box-shadow: 6px 6px 0 $ink;
    padding: 1.3rem 1.3rem 1.1rem;

    h2 { font-family: 'Bungee', sans-serif; font-size: 1.35rem; margin: 0.4rem 0 0.9rem; }
    p { line-height: 1.45; }
  }

  &__avatar { width: 64px; height: 64px; border-radius: 14px; border: 3px solid $ink; object-fit: cover; background: #5ec4bb; margin: 0 auto; }

  &__keys {
    display: grid;
    grid-template-columns: repeat(3, 3rem);
    grid-template-rows: repeat(2, 3rem);
    gap: 0.35rem;
    justify-content: center;
    margin-bottom: 0.9rem;

    .k {
      display: grid;
      place-items: center;
      background: #fff;
      border: 3px solid $ink;
      border-radius: 10px;
      box-shadow: 0 4px 0 $ink;
      font-family: 'Bungee', sans-serif;
      font-size: 1.1rem;
      animation: key-press 2.4s ease-in-out infinite;
    }
    .k--w { grid-column: 2; grid-row: 1; }
    .k--a { grid-column: 1; grid-row: 2; animation-delay: 0.6s; }
    .k--s { grid-column: 2; grid-row: 2; animation-delay: 1.2s; }
    .k--d { grid-column: 3; grid-row: 2; animation-delay: 1.8s; }
  }

  &__finger {
    position: relative;
    height: 5rem;
    margin-bottom: 0.6rem;

    i { position: absolute; left: 50%; top: 1.4rem; font-size: 2.2rem; color: $ink; animation: drag 2s ease-in-out infinite; }
  }

  &__ring {
    position: absolute;
    left: 50%;
    top: 0.6rem;
    width: 3.4rem;
    height: 3.4rem;
    margin-left: -1.7rem;
    border: 3px dashed rgba(31, 42, 44, 0.5);
    border-radius: 50%;
  }

  &__follow {
    margin-top: 0.7rem;
    padding: 0.6rem 0.8rem;
    background: #fff4c2;
    border: 2px dashed #b3842a;
    border-radius: 10px;
    font-size: 0.95rem;

    i { color: #b3842a; }
  }

  &__actions { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-top: 1rem; }

  &__text { background: none; border: none; text-decoration: underline; font: inherit; color: $ink; opacity: 0.7; cursor: pointer; }
}

@keyframes key-press {
  0%, 20%, 100% { transform: translateY(0); background: #fff; box-shadow: 0 4px 0 $ink; }
  10% { transform: translateY(4px); background: #ffe14d; box-shadow: 0 0 0 $ink; }
}
@keyframes drag {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(10%, -30%); }
}
@keyframes pulse-ring { 50% { box-shadow: 0 0 0 6px rgba(255, 225, 77, 0.6); } }

// ── dialog ─────────────────────────────────────────────────────────────────
.dialog {
  position: absolute;
  left: 50%;
  bottom: 4.25rem;
  z-index: 15;
  width: min(760px, calc(100% - 2rem));
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  cursor: pointer;

  &__portrait {
    width: clamp(84px, 18vw, 150px);
    aspect-ratio: 1;
    object-fit: cover;
    border: 3px solid $ink;
    border-radius: 14px;
    box-shadow: 4px 4px 0 $ink;
    transform: rotate(-3deg);
    flex-shrink: 0;
    background: #5ec4bb;
  }

  &__box {
    flex: 1;
    background: $cream;
    border: 3px solid $ink;
    border-radius: 14px;
    box-shadow: 5px 5px 0 $ink;
    padding: 0.9rem 1.1rem 0.8rem;
    min-height: 8.5rem;
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-family: 'Bungee', sans-serif;
    font-size: 1rem;
    span { font-family: $font-mono; font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.6; margin-left: 0.4rem; }
  }

  &__text { flex: 1; font-size: clamp(0.98rem, 2.2vw, 1.15rem); line-height: 1.4; margin: 0.4rem 0 0.6rem; }

  &__caret {
    display: inline-block;
    width: 0.5em;
    height: 1em;
    margin-left: 2px;
    vertical-align: -0.15em;
    background: $ink;
    animation: blink 0.6s steps(2) infinite;
  }

  &__actions { display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Bungee', sans-serif;
    font-size: 0.8rem;
    padding: 0.45rem 0.9rem;
    background: $ink;
    color: $cream;
    border: 2px solid $ink;
    border-radius: 8px;
    cursor: pointer;

    &--link { background: #ffe14d; color: $ink; }
    &--form { background: #ff8fd0; color: $ink; }
  }
}

// ── text mode ──────────────────────────────────────────────────────────────
.textmode {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: rgba(31, 42, 44, 0.55);
  display: grid;
  place-items: center;
  padding: 1rem;
  user-select: text;

  &__panel {
    position: relative;
    width: min(720px, 100%);
    max-height: 85vh;
    overflow-y: auto;
    background: $cream;
    border: 3px solid $ink;
    border-radius: 16px;
    box-shadow: 6px 6px 0 $ink;
    padding: 1.5rem;

    h2 { font-family: 'Bungee', sans-serif; font-size: 1.4rem; margin-bottom: 1rem; padding-right: 2rem; }

    &--wide { width: min(1100px, 100%); }
  }

  &__shortcuts { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }

  &__close {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    width: 2.2rem;
    height: 2.2rem;
    border: 2px solid $ink;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }

  &__item {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 1rem;
    padding: 1rem 0;
    border-top: 2px dashed rgba(31, 42, 44, 0.25);

    img { width: 64px; height: 64px; border-radius: 10px; border: 2px solid $ink; object-fit: cover; }
    h3 { font-family: 'Bungee', sans-serif; font-size: 1rem; span { font-family: $font-mono; font-size: 0.65rem; opacity: 0.6; text-transform: uppercase; } }
    p { margin-top: 0.35rem; line-height: 1.45; }
    a { display: inline-block; margin-top: 0.5rem; font-weight: 700; text-decoration: underline; }
  }
}

// ── transitions ────────────────────────────────────────────────────────────
.fade-enter-active, .fade-leave-active { transition: opacity 0.6s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active, .pop-leave-active { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateX(-50%) scale(0.7); }
.dialog-enter-active, .dialog-leave-active { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; transform: translateX(-50%) translateY(40px); }

@keyframes float { 50% { transform: translate(-50%, -56%) rotate(1.5deg); } }
@keyframes blink { 50% { opacity: 0; } }
@keyframes nudge { 50% { transform: translateX(-50%) translateY(-4px); } }

@media (prefers-reduced-motion: reduce) {
  .intro__planet, .talk { animation: none; }
}
</style>
