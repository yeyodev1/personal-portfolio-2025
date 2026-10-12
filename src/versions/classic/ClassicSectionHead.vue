<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; accent: string; subtitle?: string }>()
</script>

<template>
  <header class="sh">
    <span class="sh__eyebrow">{{ eyebrow }}</span>
    <h2 class="sh__title">{{ title }} <span>{{ accent }}</span></h2>
    <p v-if="subtitle" class="sh__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style lang="scss" scoped>
.sh {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 3rem;

  &__eyebrow {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $accent-cyan;
  }

  &__title {
    font-size: clamp(2rem, 5vw, 3.2rem);
    margin: 0.75rem 0 1rem;

    span {
      background: linear-gradient(135deg, $accent-primary, $accent-cyan);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle { color: $text-secondary; font-size: 1.05rem; line-height: 1.7; }
}
</style>
