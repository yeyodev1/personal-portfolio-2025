<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProjectsExplorer from '@/components/shared/ProjectsExplorer.vue'

const { t } = useI18n()
</script>

<template>
  <section id="projects" class="archive">
    <span class="tag archive__tag">{{ t('archive.tag') }}</span>
    <h2 class="archive__title">{{ t('archive.title') }}</h2>
    <p class="archive__lead">{{ t('archive.lead') }}</p>
    <ProjectsExplorer theme="stickers" :initial="9" />
  </section>
</template>

<style lang="scss" scoped>
.archive {
  max-width: 1440px;
  margin: 0 auto;
  padding: 5rem 1rem 4rem;

  @media (min-width: $breakpoint-md) { padding: 6rem 2rem 5rem; }

  &__tag { background: $pink; }

  &__title {
    font-size: clamp(2.6rem, 7vw, 5.5rem);
    line-height: 0.95;
    margin: 0.75rem 0 1rem;
  }

  &__lead { font-size: clamp(1.1rem, 2vw, 1.35rem); max-width: 38rem; margin-bottom: 2rem; }
}
</style>
