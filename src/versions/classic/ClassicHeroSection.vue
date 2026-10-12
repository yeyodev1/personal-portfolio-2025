<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GooeyText from '@/components/ui/GooeyText.vue'
import TextShimmer from '@/components/ui/TextShimmer.vue'
import SplineScene from '@/components/ui/SplineScene.vue'
import { STATS } from '@/data/projects'
import { WHATSAPP } from '@/data/links'

const { t, locale } = useI18n()
const isLoaded = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const heroRef   = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)
const glowX = ref(50)
const glowY = ref(50)

const roles = computed(() =>
  locale.value === 'es'
    ? ['Apps a medida', 'Automatizaciones', 'Bots de WhatsApp con IA', 'Tiendas online', 'Dashboards']
    : ['Custom apps', 'Automations', 'AI WhatsApp bots', 'Online stores', 'Dashboards']
)

const stats = computed(() => [
  { value: String(STATS.projects), label: t('classic.hero.stats.projects') },
  { value: '150+', label: t('classic.hero.stats.businesses') },
  { value: '6+', label: t('classic.hero.stats.years') },
  { value: '<24h', label: t('classic.hero.stats.reply') },
])

const handleMouseMove = (e: MouseEvent) => {
  const rect = heroRef.value?.getBoundingClientRect()
  if (!rect) return
  mouseX.value = (e.clientX - rect.left) / rect.width - 0.5
  mouseY.value = (e.clientY - rect.top) / rect.height - 0.5
}

const handleGlobalMouse = (e: MouseEvent) => {
  const rect = visualRef.value?.getBoundingClientRect()
  if (!rect) return
  glowX.value = ((e.clientX - rect.left) / rect.width)  * 100
  glowY.value = ((e.clientY - rect.top)  / rect.height) * 100
}

onMounted(() => {
  setTimeout(() => (isLoaded.value = true), 100)
  heroRef.value?.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mousemove', handleGlobalMouse, { passive: true })
})

onUnmounted(() => {
  heroRef.value?.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mousemove', handleGlobalMouse)
})
</script>

<template>
  <section ref="heroRef" class="hero" :class="{ 'hero--loaded': isLoaded }">
    <div class="hero__grid" />
    <div
      class="hero__glow hero__glow--violet"
      :style="{ transform: `translate(${mouseX * 40}px, ${mouseY * 40}px)` }"
    />
    <div
      class="hero__glow hero__glow--cyan"
      :style="{ transform: `translate(${mouseX * -25}px, ${mouseY * -25}px)` }"
    />
    <div ref="visualRef" class="hero__visual">
      <div class="hero__robot-glow" :style="{ '--gx': glowX + '%', '--gy': glowY + '%' }" />
      <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" class="hero__spline" />
    </div>
    <div class="hero__container">
      <div class="hero__content">
        <div class="hero__shimmer-wrap">
          <TextShimmer :text="t('classic.hero.available')" :duration="2.5" class="hero__shimmer" />
        </div>
        <p class="hero__greeting">{{ t('classic.hero.greeting') }} <span>Yeyo</span></p>
        <h1 class="hero__name">{{ t('classic.hero.title') }}</h1>
        <div class="hero__role-wrap">
          <GooeyText :texts="roles" :morph-time="1.2" :cooldown-time="2" class="hero__gooey" text-class="hero__gooey-text" />
        </div>
        <p class="hero__desc" v-html="t('classic.hero.desc')" />
        <div class="hero__actions">
          <a href="#contact" class="hero__btn hero__btn--primary">
            {{ t('classic.hero.cta') }}
            <span class="hero__btn-arrow">→</span>
          </a>
          <a href="#projects" class="hero__btn hero__btn--secondary">
            {{ t('classic.hero.seeWork') }}
          </a>
          <a :href="WHATSAPP" target="_blank" rel="noopener noreferrer" class="hero__wa">WhatsApp ↗</a>
        </div>
        <div class="hero__stats">
          <div v-for="stat in stats" :key="stat.label" class="hero__stat">
            <span class="hero__stat-value">{{ stat.value }}</span>
            <span class="hero__stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="hero__scroll">
      <span>Scroll</span>
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<style lang="scss" scoped>


// ── Animations ──────────────────────────────────────────────────────────────
@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fade-right {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(1.05); }
}
@keyframes scroll-bounce {
  0%, 100% { transform: scaleY(1); opacity: 0.4; }
  50%       { transform: scaleY(1.6); opacity: 1; }
}
@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

// ── Section ─────────────────────────────────────────────────────────────────
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: $bg-deep;
  opacity: 0;
  transition: opacity 0.6s ease;

  &--loaded { opacity: 1; }

  // Grid background
  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient($border-subtle 1px, transparent 1px),
      linear-gradient(90deg, $border-subtle 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }

  // Radial glows
  &__glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transition: transform 0.15s ease-out;

    &--violet {
      width: clamp(400px, 50vw, 700px);
      height: clamp(400px, 50vw, 700px);
      top: -10%;
      right: -5%;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%);
      animation: pulse-glow 6s ease-in-out infinite;
    }

    &--cyan {
      width: clamp(300px, 40vw, 500px);
      height: clamp(300px, 40vw, 500px);
      bottom: 10%;
      left: 5%;
      background: radial-gradient(circle, rgba(6, 214, 160, 0.1) 0%, transparent 70%);
      animation: pulse-glow 8s ease-in-out infinite 2s;
    }
  }

  // ── Container — only holds text content, floats above robot ─────────────
  &__container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 720px;           // constrain text to left half
    padding: 6rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;

    @media (min-width: $breakpoint-md) {
      padding: 0 2rem 0 3rem;
      justify-content: center;
      min-height: 100svh;
    }

    @media (min-width: $breakpoint-lg) {
      padding: 0 2rem 0 4rem;
    }
  }

  // ── Left content ──────────────────────────────────────────────────────────
  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    @media (min-width: $breakpoint-md) {
      animation: fade-left 0.9s ease-out 0.2s both;
    }
  }

  &__shimmer-wrap {
    animation: fade-up 0.8s ease-out 0.1s both;
  }

  &__shimmer {
    font-size: 0.85rem;
    font-family: 'Roboto', monospace;
    letter-spacing: 0.04em;
  }

  &__greeting {
    span { color: $accent-cyan; font-weight: 600; }
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: $text-secondary;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    animation: fade-up 0.8s ease-out 0.25s both;
  }

  &__name {
    font-size: clamp(2.3rem, 5.6vw, 4.4rem);
    font-weight: 800;
    line-height: 1;
    background: linear-gradient(135deg, $text-primary 0%, $accent-light 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fade-up 0.9s ease-out 0.35s both;
  }

  &__alias {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: $text-muted;
    font-family: 'Roboto', monospace;
    animation: fade-up 0.8s ease-out 0.4s both;

    span {
      color: $accent-cyan;
      font-weight: 600;
    }
  }

  // Gooey role
  &__role-wrap {
    height: 3.5rem;
    animation: fade-up 0.8s ease-out 0.5s both;
  }

  &__gooey {
    height: 3.5rem;
  }

  :deep(.hero__gooey-text) {
    font-size: clamp(1.5rem, 4vw, 2.2rem);
    font-weight: 700;
    color: $accent-primary;
    background: linear-gradient(135deg, $accent-primary, $accent-cyan);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Bitcount', sans-serif;
  }

  &__desc {
    max-width: 540px;
    font-size: clamp(0.95rem, 2vw, 1.05rem);
    color: $text-secondary;
    line-height: 1.75;
    animation: fade-up 0.8s ease-out 0.6s both;

    strong {
      color: $text-primary;
      font-weight: 600;
    }
  }

  // CTAs
  &__actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    animation: fade-up 0.8s ease-out 0.7s both;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: 'Roboto', sans-serif;
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;

    &--primary {
      background: $accent-primary;
      color: $text-primary;
      box-shadow: 0 0 24px $accent-glow;

      &:hover {
        background: $accent-light;
        box-shadow: 0 0 40px $accent-glow;
        transform: translateY(-2px);

        .hero__btn-arrow { transform: translateX(4px); }
      }
    }

    &--secondary {
      background: transparent;
      color: $text-primary;
      border: 1px solid $border-white;
      backdrop-filter: blur(10px);

      &:hover {
        border-color: $accent-light;
        color: $accent-light;
        transform: translateY(-2px);
      }
    }
  }

  &__btn-arrow {
    transition: transform 0.3s ease;
  }

  // Stats
  &__stats {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    animation: fade-up 0.8s ease-out 0.85s both;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: $text-primary;
    font-family: 'Bitcount', sans-serif;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.75rem;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  // ── Robot visual — covers the entire hero section ────────────────────────
  &__visual {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;

    @media (max-width: #{$breakpoint-md - 1px}) {
      opacity: 0.35;   // subtle on mobile so text stays readable
    }

    // Robot lives on the right so it never sits behind the copy.
    @media (min-width: $breakpoint-lg) {
      left: 40%;
      width: 60%;
    }
  }

  &__wa {
    align-self: center;
    color: $accent-cyan !important;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  // Mouse-following glow that follows the cursor anywhere in the hero
  &__robot-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(
      circle 480px at var(--gx, 60%) var(--gy, 50%),
      rgba(124, 58, 237, 0.30) 0%,
      rgba(6, 214, 160, 0.10) 45%,
      transparent 70%
    );
  }

  &__spline {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: auto;   // Spline still gets mouse events for head tracking
  }

  // ── Scroll indicator ──────────────────────────────────────────────────────
  &__scroll {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 5;
    animation: fade-up 1s ease-out 1.5s both;

    span {
      font-size: 0.7rem;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }

  &__scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient($accent-primary, transparent);
    animation: scroll-bounce 1.8s ease-in-out infinite;
    transform-origin: top;
  }
}
</style>
