<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LeadForm from '@/components/shared/LeadForm.vue'
import { EMAIL, INSTAGRAM, WHATSAPP } from '@/data/links'
import ClassicSectionHead from './ClassicSectionHead.vue'

const { t } = useI18n()
const direct = [
  { label: 'WhatsApp', value: '+593 96 368 1303', href: WHATSAPP, icon: 'fa-brands fa-whatsapp' },
  { label: 'Instagram', value: '@yeyo.dev', href: INSTAGRAM, icon: 'fa-brands fa-instagram' },
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, icon: 'fa-solid fa-envelope' },
]
</script>

<template>
  <section id="contact" class="contact">
    <ClassicSectionHead
      :eyebrow="t('classic.contact.eyebrow')"
      :title="t('classic.contact.title')"
      :accent="t('classic.contact.titleAccent')"
      :subtitle="t('classic.contact.subtitle')"
    />
    <div class="contact__layout">
      <LeadForm source="clasica" theme="classic" />
      <aside class="contact__aside">
        <img src="@/assets/fotos/diego.jpg" alt="Diego Reyes" class="contact__photo" />
        <strong>Diego Reyes · Yeyo</strong>
        <span class="contact__role">CTO @ Bakano</span>
        <p class="contact__direct">{{ t('classic.contact.direct') }}</p>
        <a v-for="d in direct" :key="d.label" :href="d.href" target="_blank" rel="noopener noreferrer" class="contact__link">
          <i :class="d.icon" /> <span>{{ d.value }}</span>
        </a>
        <p class="contact__based">{{ t('classic.contact.based') }}</p>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  padding: 6rem 1.5rem 7rem;
  max-width: 1200px;
  margin: 0 auto;

  &__layout {
    display: grid;
    gap: 1.5rem;
    align-items: start;

    @media (min-width: $breakpoint-lg) { grid-template-columns: minmax(0, 1fr) 300px; }
  }

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.6rem;
    border-radius: 18px;
    background: $bg-secondary;
    border: 1px solid $border-violet;

    strong { font-size: 1.1rem; }
  }

  &__photo {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center 20%;
    border: 2px solid $accent-primary;
  }

  &__role { color: $accent-cyan; font-size: 0.9rem; }

  &__direct { margin-top: 0.8rem; color: $text-secondary; font-size: 0.9rem; }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem 0.9rem;
    border-radius: 12px;
    background: $bg-elevated;
    color: $text-primary !important;
    font-size: 0.92rem;
    word-break: break-all;
    transition: background 0.2s ease;

    i { color: $accent-light; width: 1.1rem; }
    &:hover { background: rgba(124, 58, 237, 0.25); }
  }

  &__based { margin-top: 0.6rem; color: $text-muted; font-size: 0.85rem; }
}
</style>
