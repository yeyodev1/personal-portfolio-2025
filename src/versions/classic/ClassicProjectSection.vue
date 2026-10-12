<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProjectsExplorer from '@/components/shared/ProjectsExplorer.vue'
import ClassicSectionHead from './ClassicSectionHead.vue'

const { t } = useI18n()
</script>

<template>
  <section id="projects" class="projects">
    <ClassicSectionHead
      :eyebrow="t('classic.projects.eyebrow')"
      :title="t('classic.projects.title')"
      :accent="t('classic.projects.titleAccent')"
      :subtitle="t('classic.projects.subtitle')"
    />
    <ProjectsExplorer theme="classic" :initial="9" />
  </section>
</template>

<style lang="scss" scoped>
.projects {
  padding: 6rem 1.5rem;
  max-width: 1240px;
  margin: 0 auto;
}
</style>
