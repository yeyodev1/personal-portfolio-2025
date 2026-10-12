<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
const { t, isEs, toggle, init } = useLanguage()
init()
</script>

<template>
  <header class="header">
    <div class="header__container">
      <a href="/" class="header__logo">
        yeyo<span class="header__logo--dot">.</span>dev
      </a>

      <nav class="header__nav">
        <a href="#projects">{{ t('classic.nav.work') }}</a>
        <a href="#services">{{ t('classic.nav.services') }}</a>
        <a href="#process">{{ t('classic.nav.process') }}</a>
        <a href="#contact">{{ t('classic.nav.contact') }}</a>
      </nav>

      <div class="header__actions">
        <!-- Language toggle -->
        <button class="header__lang" @click="toggle" :aria-label="isEs ? 'Switch to English' : 'Cambiar a Español'">
          <span class="header__lang-track" :class="{ 'header__lang-track--en': !isEs }">
            <span class="header__lang-thumb" />
          </span>
          <span class="header__lang-label header__lang-label--es" :class="{ 'header__lang-label--active': isEs }">ES</span>
          <span class="header__lang-label header__lang-label--en" :class="{ 'header__lang-label--active': !isEs }">EN</span>
        </button>

        <a
          href="#contact"
          class="header__cta"
        >
          {{ t('classic.nav.letsTalk') }}
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  background: rgba(4, 4, 12, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid $border-subtle;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  &__logo {
    font-family: $font-principal;
    font-size: 1.4rem;
    font-weight: 700;
    color: $text-primary;
    text-decoration: none;
    letter-spacing: -0.02em;
    flex-shrink: 0;

    &--dot { color: $accent-primary; }
  }

  &__nav {
    display: none;

    @media (min-width: $breakpoint-md) {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    a {
      font-size: 0.9rem;
      font-weight: 500;
      color: $text-secondary;
      text-decoration: none;
      transition: color 0.2s ease;
      &:hover { color: $text-primary; }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  // ── Language toggle ──────────────────────────────────────────────────────────
  &__lang {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: $bg-secondary;
    border: 1px solid $border-subtle;
    border-radius: 999px;
    padding: 0.3rem 0.5rem 0.3rem 0.4rem;
    cursor: pointer;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    outline: none;

    &:hover {
      border-color: $border-violet;
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
    }
  }

  &__lang-track {
    position: relative;
    width: 28px;
    height: 16px;
    background: rgba(124, 58, 237, 0.25);
    border-radius: 999px;
    transition: background 0.3s ease;
    flex-shrink: 0;

    &--en {
      background: rgba(6, 214, 160, 0.25);
    }
  }

  &__lang-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $accent-primary;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;

    .header__lang-track--en & {
      transform: translateX(12px);
      background: $accent-cyan;
    }
  }

  &__lang-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: $text-muted;
    transition: color 0.25s ease;
    font-family: 'Roboto', sans-serif;

    &--active { color: $text-primary; }
  }

  &__cta {
    // Phones: a compact pill so the header never pushes past the screen edge.
    @media (max-width: $breakpoint-sm) {
      padding: 0.45rem 0.8rem !important;
      font-size: 0.78rem !important;
    }

    padding: 0.5rem 1.25rem;
    border-radius: 999px;
    background: $accent-primary;
    color: $text-primary;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: 'Roboto', sans-serif;
    transition: all 0.25s ease;
    box-shadow: 0 0 16px $accent-glow;
    white-space: nowrap;

    &:hover {
      background: $accent-light;
      transform: translateY(-1px);
    }
  }
}
</style>
