<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SOCIALS } from '@/data/links'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <svg class="footer__big" viewBox="0 0 1000 118" aria-hidden="true">
      <text x="0" y="104" textLength="1000" lengthAdjust="spacingAndGlyphs">{{ t('footer.big').toUpperCase() }}</text>
    </svg>
    <div class="footer__row mono">
      <span>© {{ currentYear }} {{ t('footer.copy') }}</span>
      <nav class="footer__group">
        <a href="/muro#work">{{ t('nav.work') }}</a>
        <a href="/muro#manifesto">{{ t('nav.manifesto') }}</a>
        <RouterLink to="/blog">{{ t('nav.blog') }}</RouterLink>
        <a href="/muro#contact">{{ t('nav.contact') }}</a>
      </nav>
      <nav class="footer__group">
        <a v-for="s in SOCIALS" :key="s.label" :href="s.href" target="_blank" rel="noopener noreferrer">{{ s.label }}</a>
      </nav>
      <span>{{ t('footer.made') }}</span>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem 1rem 7rem;

  @media (min-width: $breakpoint-md) { padding: 1rem 2rem 7rem; }

  &__big {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 1.25rem;

    text { font-family: $font-display; font-size: 128px; fill: $ink; }
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem 2rem;
    border-top: 2px solid $ink;
    border-bottom: 2px solid $ink;
    padding: 1.1rem 0;
    font-size: 0.72rem;

    a:hover { text-decoration: underline; }
  }

  &__group { display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem; }
}
</style>
