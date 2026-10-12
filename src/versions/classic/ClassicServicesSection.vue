<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CATEGORIES, projectsIn } from '@/data/projects'
import ClassicSectionHead from './ClassicSectionHead.vue'

const { t, locale } = useI18n()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'es'))
</script>

<template>
  <section id="services" class="services">
    <ClassicSectionHead
      :eyebrow="t('classic.services.eyebrow')"
      :title="t('classic.services.title')"
      :accent="t('classic.services.titleAccent')"
      :subtitle="t('classic.services.subtitle')"
    />
    <ul class="services__grid">
      <li v-for="(cat, i) in CATEGORIES" :key="cat.id" class="services__card" :class="{ 'services__card--hl': i < 2 }">
        <span class="services__icon" :style="{ '--c': cat.color }" aria-hidden="true"><i :class="cat.icon" /></span>
        <h3>{{ cat.label[lang] }}</h3>
        <p>{{ cat.pitch[lang] }}</p>
        <a href="#projects" class="services__count">{{ projectsIn(cat.id).length }} {{ t('classic.services.projects') }} →</a>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.services {
  padding: 6rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  &__grid {
    list-style: none;
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding: 1.6rem 1.4rem;
    background: $bg-secondary;
    border: 1px solid $border-subtle;
    border-radius: 18px;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

    &:hover { transform: translateY(-4px); border-color: $border-violet; box-shadow: 0 10px 40px $accent-glow; }

    &--hl { background: linear-gradient(160deg, rgba(124, 58, 237, 0.22), $bg-secondary 60%); border-color: $border-violet; }

    h3 { font-size: 1.35rem; }
    p { color: $text-secondary; font-size: 0.97rem; line-height: 1.6; flex: 1; }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 14px;
    font-size: 1.3rem;
    color: var(--c);
    background: color-mix(in srgb, var(--c) 18%, transparent);
    border: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
  }

  &__count { color: $accent-cyan !important; font-weight: 600; font-size: 0.9rem; }
}
</style>
