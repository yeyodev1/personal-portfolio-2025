<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
const { t, isEs, toggle, init } = useLanguage()
init()
</script>

<template>
  <header class="header">
    <div class="header__container">
      <RouterLink to="/muro" class="header__logo" aria-label="yeyo.dev">
        YEYO.DEV<sup>®</sup>
      </RouterLink>

      <nav class="header__nav">
        <a href="/muro#work">{{ t('nav.work') }}</a>
        <a href="/muro#projects">{{ t('nav.projects') }}</a>
        <a href="/muro#manifesto">{{ t('nav.manifesto') }}</a>
        <a href="/muro#contact">{{ t('nav.contact') }}</a>
      </nav>

      <div class="header__actions">
        <button
          class="header__lang"
          @click="toggle"
          :aria-label="isEs ? 'Switch to English' : 'Cambiar a Español'"
        >
          {{ isEs ? 'EN' : 'ES' }}
        </button>
        <a href="/muro#projects" class="pill-btn pill-btn--orange header__work">
          <span class="header__play" aria-hidden="true">↓</span>{{ t('nav.seeWork') }}
        </a>
        <a href="/muro#contact" class="pill-btn pill-btn--ink header__talk">
          <span class="header__talk-short">{{ t('nav.sayHelloShort') }}</span>
          <span class="header__talk-long">{{ t('nav.sayHello') }}</span>
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.85rem 1rem;

  @media (min-width: $breakpoint-md) { padding: 0.85rem 2rem; }

  &__container {
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__logo {
    font-family: $font-display;
    font-size: clamp(1.35rem, 3vw, 2rem);
    letter-spacing: -0.01em;
    color: $yellow;
    -webkit-text-stroke: 1.5px $ink;
    paint-order: stroke fill;
    text-shadow: 2px 2px 0 $ink;
    white-space: nowrap;

    sup {
      font-size: 0.4em;
      color: $ink;
      -webkit-text-stroke: 0;
      text-shadow: none;
    }
  }

  &__nav {
    display: none;
    gap: 1.75rem;
    font-weight: 500;
    font-size: 1.05rem;

    @media (min-width: $breakpoint-lg) { display: flex; }

    a:hover { text-decoration: underline; text-underline-offset: 4px; }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  &__lang {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    border: 2px solid $ink;
    background: $paper;
    font-family: $font-mono;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    flex-shrink: 0;

    &:hover { background: $yellow; }
  }

  &__work {
    display: none;
    @media (min-width: $breakpoint-md) { display: inline-flex; }
  }

  &__play {
    display: grid;
    place-items: center;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    background: $ink;
    color: $orange;
    font-size: 0.75rem;
  }

  .pill-btn { padding: 0.55rem 1.1rem; white-space: nowrap; }

  // Mobile first: short label on phones, full sentence from 480px.
  &__talk-long { display: none; }
  @media (min-width: $breakpoint-sm) {
    &__talk-short { display: none; }
    &__talk-long { display: inline; }
  }

  @media (max-width: #{$breakpoint-sm - 1px}) {
    &__actions { gap: 0.4rem; }
    &__lang { width: 2.3rem; height: 2.3rem; }
    .pill-btn { padding: 0.5rem 0.85rem; font-size: 0.9rem; }
  }
}
</style>
