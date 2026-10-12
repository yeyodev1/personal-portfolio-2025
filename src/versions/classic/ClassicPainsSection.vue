<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ClassicSectionHead from './ClassicSectionHead.vue'

const { t, tm } = useI18n()
const items = computed(() => tm('classic.pains.items') as { icon: string; color: string; pain: string; fix: string }[])
</script>

<template>
  <section class="pains">
    <ClassicSectionHead :eyebrow="t('classic.pains.eyebrow')" :title="t('classic.pains.title')" :accent="t('classic.pains.titleAccent')" />
    <ul class="pains__grid">
      <li v-for="item in items" :key="item.pain" class="pains__card">
        <span class="pains__icon" :style="{ '--c': item.color }" aria-hidden="true"><i :class="item.icon" /></span>
        <p class="pains__pain">{{ item.pain }}</p>
        <p class="pains__fix"><i class="fa-solid fa-circle-check" aria-hidden="true" /> {{ item.fix }}</p>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.pains {
  padding: 6rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  &__grid {
    list-style: none;
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  }

  &__card {
    position: relative;
    padding: 1.6rem 1.4rem;
    background: $bg-secondary;
    border: 1px solid $border-violet;
    border-radius: 18px;
    transition: transform 0.3s ease, border-color 0.3s ease;

    &:hover { transform: translateY(-4px); border-color: $accent-primary; }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 14px;
    font-size: 1.25rem;
    color: var(--c);
    background: color-mix(in srgb, var(--c) 16%, transparent);
    border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
  }

  &__pain { margin: 0.9rem 0; font-size: 1.05rem; line-height: 1.5; color: $text-primary; }

  &__fix {
    padding-top: 0.9rem;
    border-top: 1px dashed $border-white;
    color: $accent-cyan;
    font-weight: 500;
    line-height: 1.5;
  }
}
</style>
