<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__logo">yeyo<span class="footer__dot">.</span>dev</span>
          <p class="footer__tagline" style="white-space: pre-line">{{ t('classic.footer.tagline') }}</p>
        </div>
        <div class="footer__links">
          <a href="#projects">{{ t('classic.footer.links.work') }}</a>
          <a href="#services">{{ t('classic.footer.links.services') }}</a>
          <a href="#contact">{{ t('classic.footer.links.contact') }}</a>
          <a href="https://www.self.so/yeyodev" target="_blank" rel="noopener noreferrer">{{ t('classic.footer.links.resume') }}</a>
        </div>
        <div class="footer__socials">
          <a href="https://github.com/yeyodev1" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github" /></a>
          <a href="https://www.linkedin.com/in/yeyodev1" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin" /></a>
          <a href="https://wa.me/593963681303" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp" /></a>
          <a href="https://www.instagram.com/yeyo.dev/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram" /></a>
          <a href="https://x.com/yeyodev" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter" /></a>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copy">&copy; {{ currentYear }} Diego Reyes. {{ t('classic.footer.copy') }}</p>
        <p class="footer__built">{{ t('classic.footer.built') }}</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>


.footer {
  background: $bg-deep;
  border-top: 1px solid $border-subtle;
  padding: 4rem 1.5rem 2rem;

  &__container {
    max-width: 1100px;
    margin: 0 auto;
  }

  &__top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid $border-subtle;
    margin-bottom: 2rem;

    @media (min-width: $breakpoint-md) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  &__brand {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__logo {
    font-family: $font-principal;
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-primary;
  }

  &__dot {
    color: $accent-primary;
  }

  &__tagline {
    font-size: 0.875rem;
    color: $text-muted;
    line-height: 1.6;
  }

  &__links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: flex-start;

    a {
      font-size: 0.875rem;
      color: $text-secondary;
      font-family: 'Roboto', sans-serif;
      transition: color 0.2s ease;

      &:hover { color: $text-primary; }
    }
  }

  &__socials {
    display: flex;
    gap: 0.75rem;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: $bg-secondary;
      border: 1px solid $border-subtle;
      font-size: 1rem;
      color: $text-secondary;
      transition: all 0.25s ease;

      &:hover {
        border-color: $border-violet;
        color: $accent-light;
        transform: translateY(-2px);
      }
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;

    @media (min-width: $breakpoint-md) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__copy,
  &__built {
    font-size: 0.8rem;
    color: $text-muted;
  }
}
</style>
