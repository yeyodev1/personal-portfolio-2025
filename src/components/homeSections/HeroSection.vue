<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { vSticker } from '@/composables/useStickers'

const { t, tm } = useI18n()
const eyebrow = computed(() => tm('hero.eyebrow') as string[])
const facts = computed(() => tm('hero.facts') as string[])
const factColors = ['yellow', 'green', 'pink', 'blue']
</script>

<template>
  <section class="hero">
    <p class="hero__eyebrow mono">
      <template v-for="(item, i) in eyebrow" :key="item">
        <span v-if="i" class="hero__dot">•</span>{{ item }}
      </template>
    </p>

    <h1 class="hero__title">
      <span class="hero__top">{{ t('hero.titleTop') }}</span>
      <span class="hero__sticker-row">
        <span v-sticker="-2" class="hero__sticker">{{ t('hero.titleSticker') }}</span>
        <span class="hero__note" aria-hidden="true">
          {{ t('hero.note') }}
          <svg viewBox="0 0 60 50" class="hero__arrow">
            <path d="M52 4 C 50 30, 30 40, 8 38" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            <path d="M16 30 L 6 38 L 17 45" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </span>
    </h1>

    <div class="hero__bottom">
      <p class="hero__lead">{{ t('hero.lead') }}</p>
      <div class="hero__ctas">
        <a href="#projects" class="pill-btn pill-btn--orange hero__cta">↓ {{ t('hero.seeWork') }}</a>
        <a href="#contact" class="pill-btn pill-btn--ink hero__cta">{{ t('hero.whatsapp') }} →</a>
      </div>
    </div>

    <ul class="hero__facts">
      <li
        v-for="(fact, i) in facts"
        :key="fact"
        v-sticker="i % 2 ? 3 : -3"
        class="hero__fact"
        :class="`hero__fact--${factColors[i]}`"
      >
        {{ fact }}
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  max-width: 1440px;
  margin: 0 auto;
  padding: 3rem 1rem 4rem;

  @media (min-width: $breakpoint-md) { padding: 4rem 2rem 5rem; }

  &__eyebrow {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.9rem;
    margin-bottom: 1.5rem;
  }

  &__dot { color: $orange; margin-right: 0.9rem; }

  &__title {
    font-size: clamp(2.7rem, 8vw, 7.4rem);
    line-height: 0.95;
    letter-spacing: -0.02em;
  }

  &__top { display: block; max-width: 14ch; }

  &__sticker-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 2.5rem;
    margin-top: 0.15em;
  }

  &__sticker {
    display: inline-block;
    background: $orange;
    padding: 0.08em 0.25em 0.14em;
    border-radius: 0.18em;
    box-shadow: 0 0 0 0.09em $paper, 0 0 0 calc(0.09em + 1px) #d9d9d9, 0 10px 24px rgba(0, 0, 0, 0.12);
    position: relative;

    // peeled corner
    &::after {
      content: '';
      position: absolute;
      right: -0.04em;
      bottom: -0.04em;
      width: 0.4em;
      height: 0.4em;
      background: linear-gradient(135deg, #e86a10 50%, #f6f0e6 50%);
      border-radius: 0 0 0.18em 0;
      box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.12);
    }
  }

  &__note {
    display: none;
    font-family: $font-hand;
    font-size: 1.5rem;
    line-height: 1;
    color: $blue;
    transform: rotate(-6deg);
    text-transform: uppercase;
    letter-spacing: 0.02em;

    @media (min-width: $breakpoint-lg) { display: flex; flex-direction: column; align-items: flex-start; }
  }

  &__arrow { width: 70px; margin-top: 0.3rem; }

  &__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1.75rem 3rem;
    margin-top: 2.5rem;
  }

  &__lead {
    max-width: 36rem;
    font-size: clamp(1.15rem, 2vw, 1.45rem);
    line-height: 1.35;
  }

  &__ctas { display: flex; flex-wrap: wrap; gap: 0.75rem; }

  &__cta { font-size: 1.1rem; padding: 0.85rem 1.5rem; }

  &__facts {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    margin-top: 2.75rem;
  }

  &__fact {
    font-family: $font-mono;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    border: 2px solid $paper;
    box-shadow: 0 0 0 1px #ddd, 0 6px 14px rgba(0, 0, 0, 0.08);

    &--yellow { background: $yellow; }
    &--green { background: $green; }
    &--pink { background: $pink; }
    &--blue { background: $blue; color: $paper; }
  }
}
</style>
