<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const items = ['Vue.js', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Vite', 'Claude', 'OpenAI', 'Meta API', 'WhatsApp API', 'Contifico', 'Stripe']
</script>

<template>
  <section class="marquee" :aria-label="t('stack.label')">
    <span class="marquee__tag mono">{{ t('stack.label') }}</span>
    <div class="marquee__track">
      <ul v-for="n in 2" :key="n" class="marquee__list" :aria-hidden="n === 2">
        <li v-for="item in items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.marquee {
  position: relative;
  max-width: calc(1440px - 4rem);
  margin: 1rem 1rem 0;
  background: $cream;
  padding: 1.6rem 0 1.4rem;
  overflow: hidden;

  @media (min-width: $breakpoint-md) { margin: 1rem 2rem 0; }
  @media (min-width: 1504px) { margin: 1rem auto 0; }

  &__tag {
    position: absolute;
    top: 0.4rem;
    left: 2.5rem;
    z-index: 2;
    background: $ink;
    color: $paper;
    font-size: 0.7rem;
    padding: 0.3rem 0.8rem;
    transform: rotate(-3deg);
  }

  &__track {
    display: flex;
    width: max-content;
    animation: scroll 40s linear infinite;
  }

  &:hover &__track { animation-play-state: paused; }

  &__list {
    list-style: none;
    display: flex;
    gap: 3.5rem;
    padding-right: 3.5rem;

    li {
      font-family: $font-display;
      font-size: clamp(1.4rem, 3vw, 2rem);
      color: #3a3a3a;
      white-space: nowrap;
    }
  }
}

@keyframes scroll {
  to { transform: translateX(-50%); }
}
</style>
