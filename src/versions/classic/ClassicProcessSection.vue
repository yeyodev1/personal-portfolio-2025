<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ClassicSectionHead from './ClassicSectionHead.vue'

const { t, tm } = useI18n()
const steps = computed(() => tm('classic.process.steps') as { n: string; title: string; text: string }[])
</script>

<template>
  <section id="process" class="process">
    <ClassicSectionHead :eyebrow="t('classic.process.eyebrow')" :title="t('classic.process.title')" :accent="t('classic.process.titleAccent')" />
    <ol class="process__steps">
      <li v-for="step in steps" :key="step.n" class="process__step">
        <span class="process__n">{{ step.n }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>

<style lang="scss" scoped>
.process {
  padding: 6rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  &__steps {
    list-style: none;
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    counter-reset: step;
  }

  &__step {
    position: relative;
    padding: 1.6rem 1.4rem;
    border-radius: 18px;
    background: $bg-secondary;
    border: 1px solid $border-subtle;

    h3 { font-size: 1.25rem; margin: 0.6rem 0 0.5rem; }
    p { color: $text-secondary; line-height: 1.6; }
  }

  &__n {
    font-family: 'Bitcount', sans-serif;
    font-size: 2.4rem;
    background: linear-gradient(135deg, $accent-primary, $accent-cyan);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
</style>
