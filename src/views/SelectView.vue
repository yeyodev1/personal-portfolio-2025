<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useArcade, type Version } from '@/composables/useArcade'
import { useLanguage } from '@/composables/useLanguage'
import { WHATSAPP } from '@/data/links'
import { STATS } from '@/data/projects'
import { useLostVisitor } from '@/composables/useLostVisitor'
import SelectGuide from '@/components/select/SelectGuide.vue'
import { preloadFonts, preloadImages, usePagePreload } from '@/composables/usePreloader'
import { cdn } from '@/data/cdn'
import CdnImg from '@/components/shared/CdnImg.vue'

const router = useRouter()
const { t } = useI18n()
const { isEs, toggle } = useLanguage()
const { blip, select, start, soundOn, toggleSound, lastVersion, rememberVersion } = useArcade()

const versions: { id: Version; cover: string; color: string; stats: [number, number, number] }[] = [
  { id: 'clasica', cover: '/game/cover-classic.jpg', color: '#7c3aed', stats: [3, 4, 2] },
  { id: 'muro', cover: '/game/cover-muro.jpg', color: '#ff7a1a', stats: [4, 4, 4] },
  { id: 'mundo', cover: '/game/cover-mundo.jpg', color: '#46a8a8', stats: [5, 2, 5] },
]
const statKeys = ['vibe', 'speed', 'fun'] as const

const preload = usePagePreload('arcade')
preload.add(
  ...preloadFonts(['Press Start 2P', 'Bowlby One', 'Instrument Sans']),
  ...preloadImages([...versions.map((v) => cdn(v.cover, 260)), cdn('/game/yeyo.jpg', 64)]),
)

const last = lastVersion()
const active = ref(Math.max(0, versions.findIndex((v) => v.id === (last ?? 'mundo'))))
const launching = ref<Version | null>(null)
const current = computed(() => versions[active.value]!)

// ── guide for visitors who look lost ────────────────────────────────────────
const isTouch = ref(false)
const guideOpen = ref(false)
const guideStep = ref(-1)
let autoShown = false
const { lost, progress, dismiss } = useLostVisitor({
  idleMs: 8000,
  enabled: () => !guideOpen.value && !launching.value && !autoShown,
})
watch(lost, (isLost) => {
  if (!isLost) return
  autoShown = true
  openGuide()
})

const openGuide = () => {
  guideOpen.value = true
  select()
}

const closeGuide = () => {
  guideOpen.value = false
  dismiss()
}

const MURO = versions.findIndex((v) => v.id === 'muro')
const guideToMuro = () => {
  guideOpen.value = false
  launch(MURO)
}

const move = (dir: number) => {
  if (launching.value) return
  progress()
  active.value = (active.value + dir + versions.length) % versions.length
  blip()
}

const launch = (index: number) => {
  if (launching.value) return
  progress()
  const v = versions[index]!
  active.value = index
  launching.value = v.id
  rememberVersion(v.id)
  start()
  window.setTimeout(() => router.push(`/${v.id}`), 900)
}

// Desktop: first click picks the cartridge, a second one plays it.
const pick = (index: number) => {
  if (launching.value) return
  // On phones a tap while scrolling must never start a version; only the «Jugar» button does.
  if (isTouch.value) {
    active.value = index
    return
  }
  if (index === active.value) return launch(index)
  active.value = index
  select()
}

const onKey = (e: KeyboardEvent) => {
  if (guideOpen.value) {
    if (e.key === 'Escape') closeGuide()
    return
  }
  if (e.key === 'ArrowRight' || e.key === 'd') move(1)
  else if (e.key === 'ArrowLeft' || e.key === 'a') move(-1)
  else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    launch(active.value)
  }
}

onMounted(() => {
  isTouch.value = window.matchMedia('(hover: none)').matches
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="select"
    :class="{ 'is-launching': launching, 'select--guide-carts': guideStep === 1, 'select--guide-pick': guideStep === 2 }"
    :style="{ '--accent': current.color }"
  >
    <div class="select__bg" aria-hidden="true" />

    <header class="select__top">
      <span class="select__brand">YEYO.DEV</span>
      <div class="select__tools">
        <button class="select__help" :class="{ 'select__help--nudge': lost }" @click="openGuide">
          <i class="fa-solid fa-circle-question" aria-hidden="true" /> {{ t('select.guide.help') }}
        </button>
        <a :href="WHATSAPP" target="_blank" rel="noopener noreferrer" class="select__hurry"><i class="fa-brands fa-whatsapp" aria-hidden="true" /> {{ t('select.hurry') }}</a>
        <button class="select__chip" :aria-pressed="soundOn" @click="toggleSound"><i :class="soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'" aria-hidden="true" /></button>
        <button class="select__chip" @click="toggle">{{ isEs ? 'EN' : 'ES' }}</button>
      </div>
    </header>

    <section class="select__head">
      <p class="select__insert">▶ {{ t('select.insert') }}</p>
      <h1 class="select__title">{{ t('select.title') }}</h1>
      <p class="select__intro">{{ t('select.intro') }}</p>
    </section>

    <ul class="select__carts" role="listbox" :aria-label="t('select.title')">
      <li
        v-for="(v, i) in versions"
        :key="v.id"
        role="option"
        :aria-selected="i === active"
        class="cart"
        :class="{ 'cart--active': i === active, 'cart--launch': launching === v.id, 'cart--recommended': guideStep === 2 && v.id === 'muro' }"
        :style="{ '--cart': v.color }"
        tabindex="0"
        @click="pick(i)"
        @mouseenter="i !== active && !launching && ((active = i), blip())"
        @focus="active = i"
      >
        <span v-if="i === active" class="cart__p1">▼ {{ t('select.player') }}</span>
        <span v-if="last === v.id" class="cart__last">{{ t('select.last') }}</span>
        <div class="cart__shell">
          <div class="cart__ridges" aria-hidden="true"><span v-for="n in 6" :key="n" /></div>
          <div class="cart__label">
            <CdnImg :src="v.cover" :width="260" :alt="t(`select.versions.${v.id}.name`)" eager />
            <div class="cart__name">
              <strong>{{ t(`select.versions.${v.id}.name`) }}</strong>
              <span>{{ t(`select.versions.${v.id}.genre`) }}</span>
            </div>
          </div>
          <span class="cart__num">0{{ i + 1 }}</span>
        </div>

        <!-- Mobile only: each cartridge explains itself and has its own play button -->
        <div class="cart__details">
          <strong class="cart__details-name">{{ t(`select.versions.${v.id}.name`) }}</strong>
          <p>{{ t(`select.versions.${v.id}.desc`) }}</p>
          <button class="select__play select__play--small" @click.stop="launch(i)">{{ t('select.play') }} ▶</button>
        </div>
      </li>
    </ul>

    <section class="select__info" aria-live="polite">
      <p class="select__desc">{{ t(`select.versions.${current.id}.desc`) }}</p>
      <ul class="select__stats">
        <li v-for="(key, k) in statKeys" :key="key">
          <span class="select__stat-label">{{ t(`select.statLabels.${key}`) }}</span>
          <span class="select__bar">
            <i v-for="n in 5" :key="n" :class="{ on: n <= current.stats[k]! }" />
          </span>
        </li>
      </ul>
      <button class="select__play" @click="launch(active)">{{ t('select.play') }} · {{ t(`select.versions.${current.id}.name`) }} ▶</button>
    </section>

    <footer class="select__foot">
      <span>{{ t('select.same', { n: STATS.projects }) }}</span>
      <a :href="WHATSAPP" target="_blank" rel="noopener noreferrer" class="select__hurry select__hurry--foot"><i class="fa-brands fa-whatsapp" aria-hidden="true" /> {{ t('select.hurry') }}</a>
      <span class="select__keys">{{ t('select.hint') }}</span>
    </footer>

    <SelectGuide :open="guideOpen" :touch="isTouch" @close="closeGuide" @go-muro="guideToMuro" @step="guideStep = $event" />

    <div class="select__flash" aria-hidden="true" />
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

$pixel: 'Press Start 2P', ui-monospace, monospace;
$desktop: 761px;

.select {
  --accent: #46a8a8;
  // Cartridge width is driven by the viewport height so the whole screen fits on desktop.
  --cart-w: clamp(140px, min(20vw, 27vh), 250px);
  position: relative;
  min-height: 100dvh;
  color: #fff;
  background: #0b0a1a;
  font-family: $font-body;
  padding: 0.9rem 1rem 5.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: $desktop) {
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
    padding: 1rem 2rem 4.6rem;
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr) auto auto;
    justify-items: center;
  }

  &__bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse at 50% 120%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 60%),
      radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.5) 0 1px, transparent 2px) 0 0 / 120px 120px,
      radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.35) 0 1px, transparent 2px) 0 0 / 90px 90px,
      linear-gradient(#0b0a1a, #14112b);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 3px);
    }
  }

  // The guide is fixed to the viewport, so it stays out of this rule.
  > *:not(.guide) { position: relative; }

  &__top {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  &__brand {
    font-family: $font-display;
    font-size: 1.3rem;
    color: $yellow;
    -webkit-text-stroke: 1.5px #000;
    paint-order: stroke fill;
    text-shadow: 2px 2px 0 #000;
  }

  &__tools { display: flex; align-items: center; gap: 0.5rem; }

  &__hurry {
    font-family: $pixel;
    font-size: 0.55rem;
    color: $green;
    text-decoration: underline;
    text-underline-offset: 4px;
    margin-right: 0.4rem;
    white-space: nowrap;

    // On phones it moves to the footer so the top bar never overflows.
    @media (max-width: 600px) { display: none; }

    &--foot {
      display: none;
      margin: 0.6rem 0 0;
      font-size: 0.65rem;
      @media (max-width: 600px) { display: inline-block; }
    }
  }

  &__help {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    height: 2.4rem;
    padding: 0 0.8rem;
    border-radius: 8px;
    border: 2px solid $yellow;
    background: rgba(255, 225, 77, 0.12);
    color: $yellow;
    font-family: $pixel;
    font-size: 0.55rem;
    cursor: pointer;

    i { font-size: 0.95rem; }
    &:hover { background: rgba(255, 225, 77, 0.25); }
    &--nudge { animation: nudge-help 0.9s ease-in-out infinite; }
  }

  &--guide-carts .cart__shell { animation: guide-ring 1.4s ease-in-out infinite; }

  &__chip {
    min-width: 2.4rem;
    height: 2.4rem;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    font-family: $pixel;
    font-size: 0.6rem;
    cursor: pointer;

    i { font-size: 0.95rem; color: $yellow; }

    &:hover { border-color: #fff; }
  }

  &__head {
    text-align: center;
    margin: 1.5rem 0 1.25rem;
    max-width: 760px;

    @media (min-width: $desktop) { margin: min(2vh, 1.25rem) 0 0; }
  }

  &__insert {
    font-family: $pixel;
    font-size: 0.62rem;
    color: $yellow;
    animation: blink 1.1s steps(2) infinite;
  }

  &__title {
    font-family: $pixel;
    font-size: clamp(1.05rem, 5vw, 1.5rem);
    line-height: 1.5;
    margin-top: 0.8rem;
    white-space: pre-line;
    text-shadow: 3px 3px 0 var(--accent);
    transition: text-shadow 0.4s ease;

    @media (min-width: $desktop) { font-size: clamp(1rem, min(2.6vw, 4vh), 2rem); margin-top: min(1.4vh, 0.9rem); }
  }

  &__intro {
    margin-top: 0.9rem;
    font-size: 1.02rem;
    line-height: 1.45;
    opacity: 0.9;

    @media (min-width: $desktop) { margin-top: min(1.2vh, 0.8rem); font-size: clamp(0.9rem, 2vh, 1.05rem); }
  }

  // ── cartridges ───────────────────────────────────────────────────────────
  &__carts {
    list-style: none;
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: $desktop) {
      max-width: 1000px;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: clamp(1rem, 3vw, 2.5rem);
      padding-top: 1.6rem;
      min-height: 0;
    }
  }

  // ── desktop info bar ─────────────────────────────────────────────────────
  &__info {
    display: none;

    @media (min-width: $desktop) {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      max-width: 1000px;
      margin-top: min(2vh, 1rem);
      padding: 0.8rem 1rem;
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.35);
    }
  }

  &__desc { font-size: 0.98rem; line-height: 1.4; }

  &__stats {
    list-style: none;
    display: grid;
    gap: 0.35rem;

    li { display: grid; grid-template-columns: 4.8rem 6rem; align-items: center; gap: 0.6rem; }
  }

  &__stat-label { font-family: $pixel; font-size: 0.48rem; text-transform: uppercase; text-align: right; opacity: 0.75; }

  &__bar {
    display: flex;
    gap: 3px;

    i {
      flex: 1;
      height: 9px;
      background: rgba(255, 255, 255, 0.12);
      transition: background 0.3s ease;
      &.on { background: var(--accent); }
    }
  }

  &__play {
    font-family: $pixel;
    font-size: 0.68rem;
    padding: 0.9rem 1.1rem;
    background: $yellow;
    color: #111;
    border: 3px solid #000;
    box-shadow: 0 5px 0 #b8941a, 0 5px 0 3px #000;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.1s ease, box-shadow 0.1s ease;

    &:hover { transform: translateY(-2px); }
    &:active { transform: translateY(4px); box-shadow: 0 1px 0 #b8941a, 0 1px 0 3px #000; }

    &--small { font-size: 0.6rem; padding: 0.7rem 0.9rem; align-self: flex-start; }
  }

  &__foot {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.8;

    @media (min-width: $desktop) { margin-top: min(1.4vh, 0.8rem); flex-direction: row; gap: 1.5rem; font-size: 0.85rem; }
  }

  &__keys {
    display: none;
    font-family: $pixel;
    font-size: 0.5rem;
    opacity: 0.7;

    @media (min-width: $desktop) and (hover: hover) { display: inline; }
  }

  &__flash {
    position: fixed;
    inset: 0;
    background: #fff;
    opacity: 0;
    pointer-events: none;
  }

  &.is-launching &__flash { animation: flash 0.9s ease forwards; }

  @media (max-width: 760px) { &__flash { background: #0b0a1a; } }
}

.cart {
  --cart: #46a8a8;
  position: relative;
  cursor: pointer;
  outline: none;
  display: grid;
  grid-template-columns: 38% minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);

  @media (min-width: $desktop) {
    display: block;
    flex: 0 0 auto;
    width: var(--cart-w);
    padding: 0;
    border: none;
    background: none;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
    filter: saturate(0.55) brightness(0.7);
    transform: translateY(12px) scale(0.92);
  }

  &--active {
    border-color: var(--cart);

    @media (min-width: $desktop) {
      filter: none;
      transform: translateY(0) scale(1);
      animation: hover-bob 2.4s ease-in-out infinite;
    }
  }

  &--launch {
    animation: insert 0.9s cubic-bezier(0.6, -0.3, 0.7, 0.4) forwards !important;

    // In the phone list a cartridge falling 70vh looks like a broken page: just pulse instead.
    @media (max-width: 760px) { animation: launch-pulse 0.6s ease forwards !important; }
  }

  &__p1 {
    display: none;

    @media (min-width: $desktop) {
      display: block;
      position: absolute;
      top: -1.6rem;
      left: 50%;
      transform: translateX(-50%);
      font-family: $pixel;
      font-size: 0.55rem;
      color: $yellow;
      white-space: nowrap;
      animation: blink 0.9s steps(2) infinite;
    }
  }

  &__last {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    z-index: 2;
    background: $pink;
    color: #111;
    font-family: $pixel;
    font-size: 0.42rem;
    padding: 0.3rem 0.45rem;
    transform: rotate(6deg);
    box-shadow: 2px 2px 0 #000;

    @media (min-width: $desktop) { top: 0.6rem; right: -0.6rem; }
  }

  &__shell {
    position: relative;
    background: var(--cart);
    border: 3px solid #000;
    border-radius: 10px 10px 4px 4px;
    padding: 0.6rem 0.5rem 1.6rem;
    box-shadow: inset 0 4px 0 rgba(255, 255, 255, 0.25), inset 0 -6px 0 rgba(0, 0, 0, 0.25), 0 8px 0 #000;

    @media (min-width: $desktop) { padding: 0.8rem 0.65rem 1.9rem; }

    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: 50%;
      width: 34%;
      height: 10px;
      transform: translateX(-50%);
      background: #0b0a1a;
      border: 3px solid #000;
      border-top: none;
      border-radius: 0 0 6px 6px;
    }
  }

  &--active &__shell { box-shadow: inset 0 4px 0 rgba(255, 255, 255, 0.25), inset 0 -6px 0 rgba(0, 0, 0, 0.25), 0 8px 0 #000, 0 0 40px color-mix(in srgb, var(--cart) 70%, transparent); }

  &__ridges {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 0.5rem;

    span { width: 5px; height: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 2px; }
  }

  &__label {
    background: #fff;
    border: 3px solid #000;
    border-radius: 4px;
    overflow: hidden;

    img { width: 100%; aspect-ratio: 3 / 3.3; object-fit: cover; object-position: top; }
  }

  &__name {
    display: none;
    padding: 0.4rem 0.5rem 0.5rem;
    color: #111;
    border-top: 3px solid #000;

    @media (min-width: $desktop) { display: block; }

    strong { display: block; font-family: $pixel; font-size: clamp(0.5rem, 1vw, 0.7rem); line-height: 1.3; }
    span { font-family: $font-mono; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; color: #555; }
  }

  &__num {
    position: absolute;
    bottom: 0.4rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: $pixel;
    font-size: 0.55rem;
    color: rgba(0, 0, 0, 0.5);
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    p { font-size: 0.95rem; line-height: 1.4; opacity: 0.9; }

    @media (min-width: $desktop) { display: none; }
  }

  &__details-name { font-family: $pixel; font-size: 0.75rem; line-height: 1.4; color: $yellow; }
}

@keyframes blink { 50% { opacity: 0; } }
@keyframes nudge-help { 50% { transform: translateY(-3px) scale(1.05); box-shadow: 0 0 18px rgba(255, 225, 77, 0.6); } }
@keyframes guide-ring { 50% { box-shadow: inset 0 4px 0 rgba(255, 255, 255, 0.25), 0 8px 0 #000, 0 0 0 6px #ffe14d; } }

.cart--recommended {
  filter: none !important;

  .cart__shell { box-shadow: 0 8px 0 #000, 0 0 0 6px #ff7a1a, 0 0 50px rgba(255, 122, 26, 0.8) !important; }

  &::after {
    content: '★';
    position: absolute;
    top: -0.9rem;
    left: -0.6rem;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: #ff7a1a;
    border: 3px solid #000;
    color: #111;
    font-size: 1.1rem;
    animation: hover-bob 1.2s ease-in-out infinite;
  }
}
@keyframes hover-bob { 50% { transform: translateY(-7px) scale(1); } }
@keyframes insert {
  30% { transform: translateY(-30px) scale(1.04); }
  100% { transform: translateY(70vh) scale(0.9); }
}
@keyframes launch-pulse {
  40% { transform: scale(1.03); }
  100% { transform: scale(0.98); opacity: 0.6; }
}
@keyframes flash {
  0%, 55% { opacity: 0; }
  75%, 100% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .cart--active { animation: none; }
}

</style>

<style lang="scss">
// Overscroll/bounce on phones must show the arcade dark, not the white page body.
html:has(.select),
html:has(.select) body { background: #0b0a1a; }
</style>
