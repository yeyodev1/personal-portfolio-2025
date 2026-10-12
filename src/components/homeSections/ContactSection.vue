<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { EMAIL, SOCIALS } from '@/data/links'
import LeadForm from '@/components/shared/LeadForm.vue'

const { t } = useI18n()
const { triggerToast } = useToast()

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(EMAIL)
    triggerToast(t('contact.copied'), 'success')
  } catch {
    window.location.href = `mailto:${EMAIL}`
  }
}
</script>

<template>
  <section id="contact" class="contact">
    <span class="tag contact__tag">{{ t('contact.tag') }}</span>
    <h2 class="contact__title">{{ t('contact.title') }}</h2>
    <p class="contact__lead">{{ t('contact.lead') }}</p>

    <LeadForm source="muro" theme="stickers" class="contact__form" />

    <p class="mono contact__note">{{ t('contact.note') }}</p>
    <div class="contact__email-row">
      <a :href="`mailto:${EMAIL}`" class="contact__email">{{ EMAIL }}</a>
      <button class="pill-btn" @click="copyEmail">{{ t('contact.copy') }}</button>
    </div>

    <div class="contact__socials">
      <a
        v-for="s in SOCIALS"
        :key="s.label"
        :href="s.href"
        target="_blank"
        rel="noopener noreferrer"
        class="pill-btn"
        :class="{ 'pill-btn--ink': s.label === 'WhatsApp' }"
      >
        {{ s.label }}
      </a>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  max-width: 1440px;
  margin: 0 auto;
  padding: 5rem 1rem 3rem;

  @media (min-width: $breakpoint-md) { padding: 7rem 2rem 4rem; }

  &__tag { background: $orange; }

  &__title {
    font-size: clamp(4rem, 15vw, 12rem);
    line-height: 0.9;
    letter-spacing: -0.02em;
    margin: 0.75rem 0 1.25rem;
  }

  &__lead { font-size: clamp(1.15rem, 2vw, 1.5rem); max-width: 34rem; line-height: 1.3; margin-bottom: 2rem; }

  &__form { max-width: 920px; margin-bottom: 3rem; }

  &__email-row { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }

  &__email {
    font-family: $font-display;
    font-size: clamp(1.15rem, 4vw, 2.8rem);
    line-height: 1.1;
    background: $yellow;
    padding: 0.15em 0.35em 0.25em;
    border-radius: 6px;
    word-break: break-all;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover { transform: rotate(-1deg) scale(1.01); }
  }

  &__note { text-transform: none; letter-spacing: 0.02em; color: $grey; margin: 0 0 0.75rem; font-size: 0.85rem; }

  &__socials { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.5rem; }
}
</style>
