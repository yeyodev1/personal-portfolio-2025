<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLead, type Need } from '@/composables/useLead'
import { INSTAGRAM, WHATSAPP } from '@/data/links'

const props = withDefaults(defineProps<{ source: string; theme?: 'stickers' | 'classic' | 'game'; compact?: boolean }>(), {
  theme: 'stickers',
  compact: false,
})

const { t } = useI18n()
const { form, status, error, sentName, toggleNeed, submit, reset } = useLead(props.source)

const needs: { id: Need; icon: string; color: string }[] = [
  { id: 'app', icon: 'fa-solid fa-mobile-screen', color: '#7c3aed' },
  { id: 'automatizacion', icon: 'fa-solid fa-gears', color: '#10b981' },
  { id: 'web', icon: 'fa-solid fa-globe', color: '#e5173f' },
  { id: 'tienda', icon: 'fa-solid fa-cart-shopping', color: '#ff7a1a' },
  { id: 'dashboard', icon: 'fa-solid fa-chart-pie', color: '#2f4bff' },
  { id: 'ia', icon: 'fa-solid fa-robot', color: '#06b6d4' },
  { id: 'integracion', icon: 'fa-solid fa-plug', color: '#f59e0b' },
  { id: 'otro', icon: 'fa-solid fa-lightbulb', color: '#eab308' },
]
const budgets = ['800-1.5k', '1.5k-3k', '3k-8k', '8k-mas']
const timelines = ['urgente', '1-mes', '1-3-meses', 'explorando']
</script>

<template>
  <div class="lf" :class="[`lf--${theme}`, { 'lf--compact': compact }]">
    <Transition name="lf-swap" mode="out-in">
      <div v-if="status === 'sent'" key="ok" class="lf__done" role="status">
        <span class="lf__done-icon" aria-hidden="true"><i class="fa-solid fa-envelope-circle-check" /></span>
        <h3>{{ t('lead.successTitle', { name: sentName }) }}</h3>
        <p>{{ t('lead.successText') }}</p>
        <div class="lf__quick">
          <a :href="WHATSAPP" target="_blank" rel="noopener noreferrer" class="lf__btn lf__btn--wa"><i class="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp</a>
          <a :href="INSTAGRAM" target="_blank" rel="noopener noreferrer" class="lf__btn lf__btn--ig"><i class="fa-brands fa-instagram" aria-hidden="true" /> @yeyo.dev</a>
        </div>
        <button class="lf__ghost" @click="reset">{{ t('lead.another') }}</button>
      </div>

      <form v-else key="form" class="lf__form" novalidate @submit.prevent="submit">
        <!-- honeypot: invisible to people, tempting for bots -->
        <input v-model="form.website" class="lf__hp" tabindex="-1" autocomplete="off" aria-hidden="true" name="website" />

        <div class="lf__row">
          <label class="lf__field">
            <span>{{ t('lead.name') }} *</span>
            <input v-model="form.name" required maxlength="120" autocomplete="name" :placeholder="t('lead.namePh')" />
          </label>
          <label class="lf__field">
            <span>{{ t('lead.email') }} *</span>
            <input v-model="form.email" type="email" required maxlength="160" autocomplete="email" :placeholder="t('lead.emailPh')" />
          </label>
        </div>

        <div class="lf__row">
          <label class="lf__field">
            <span>{{ t('lead.whatsapp') }}</span>
            <input v-model="form.whatsapp" type="tel" maxlength="40" autocomplete="tel" :placeholder="t('lead.whatsappPh')" />
          </label>
          <label class="lf__field">
            <span>{{ t('lead.company') }}</span>
            <input v-model="form.company" maxlength="140" autocomplete="organization" :placeholder="t('lead.companyPh')" />
          </label>
        </div>

        <fieldset class="lf__field">
          <legend>{{ t('lead.needs') }}</legend>
          <div class="lf__chips">
            <button
              v-for="n in needs"
              :key="n.id"
              type="button"
              :aria-pressed="form.needs.includes(n.id)"
              :class="{ on: form.needs.includes(n.id) }"
              @click="toggleNeed(n.id)"
            >
              <i :class="n.icon" :style="{ color: n.color }" aria-hidden="true" />
              {{ t(`lead.needOptions.${n.id}`) }}
            </button>
          </div>
        </fieldset>

        <label class="lf__field">
          <span>{{ t('lead.description') }} *</span>
          <textarea v-model="form.description" required minlength="10" maxlength="4000" rows="4" :placeholder="t('lead.descriptionPh')" />
        </label>

        <div class="lf__row">
          <fieldset class="lf__field">
            <legend>{{ t('lead.budget') }} *</legend>
            <div class="lf__chips lf__chips--small">
              <button
                v-for="b in budgets"
                :key="b"
                type="button"
                :aria-pressed="form.budget === b"
                :class="{ on: form.budget === b }"
                @click="form.budget = form.budget === b ? '' : b"
              >
                {{ t(`lead.budgetOptions.${b.replace(/\./g, '_')}`) }}
              </button>
            </div>
          </fieldset>
          <fieldset class="lf__field">
            <legend>{{ t('lead.timeline') }}</legend>
            <div class="lf__chips lf__chips--small">
              <button
                v-for="tl in timelines"
                :key="tl"
                type="button"
                :aria-pressed="form.timeline === tl"
                :class="{ on: form.timeline === tl }"
                @click="form.timeline = form.timeline === tl ? '' : tl"
              >
                {{ t(`lead.timelineOptions.${tl}`) }}
              </button>
            </div>
          </fieldset>
        </div>

        <div class="lf__min" role="note">
          <i class="fa-solid fa-circle-info" aria-hidden="true" />
          <div>
            <strong>{{ t('lead.minTitle') }}</strong>
            <p>{{ t('lead.minText') }}</p>
            <label class="lf__accept">
              <input v-model="form.acceptsMinimum" type="checkbox" required />
              <span>{{ t('lead.accept') }}</span>
            </label>
          </div>
        </div>

        <p v-if="status === 'error'" class="lf__error" role="alert"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true" /> {{ error }}</p>

        <div class="lf__submit">
          <button type="submit" class="lf__btn lf__btn--primary" :disabled="status === 'sending'">
            <i :class="status === 'sending' ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'" aria-hidden="true" />
            {{ status === 'sending' ? t('lead.sending') : t('lead.submit') }}
          </button>
          <small><i class="fa-solid fa-lock" aria-hidden="true" /> {{ t('lead.privacy') }}</small>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.lf {
  --f-ink: #0d0d0d;
  --f-muted: #5c5c5c;
  --f-bg: #fff;
  --f-input: #fff;
  --f-border: 2px solid #0d0d0d;
  --f-radius: 10px;
  --f-accent: #ff7a1a;
  --f-accent-ink: #0d0d0d;
  --f-chip-on: #ffe14d;
  --f-focus: #2f4bff;
  --f-shadow: 5px 5px 0 #0d0d0d;
  --f-display: 'Bowlby One', sans-serif;

  &--classic {
    --f-ink: #f1f5f9;
    --f-muted: #94a3b8;
    --f-bg: #0d0d22;
    --f-input: #07071a;
    --f-border: 1px solid rgba(124, 58, 237, 0.35);
    --f-radius: 14px;
    --f-accent: #7c3aed;
    --f-accent-ink: #fff;
    --f-chip-on: #7c3aed;
    --f-focus: #06d6a0;
    --f-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    --f-display: 'Bitcount', sans-serif;
  }

  &--game {
    --f-ink: #1f2a2c;
    --f-muted: #5d6b6d;
    --f-bg: #f4efe1;
    --f-input: #fffdf6;
    --f-border: 3px solid #1f2a2c;
    --f-radius: 12px;
    --f-accent: #e9b949;
    --f-accent-ink: #1f2a2c;
    --f-chip-on: #8fd6cc;
    --f-focus: #2f4bff;
    --f-shadow: none;
    --f-display: 'Bungee', sans-serif;
  }

  color: var(--f-ink);
  background: var(--f-bg);
  border: var(--f-border);
  border-radius: var(--f-radius);
  box-shadow: var(--f-shadow);
  padding: clamp(1.1rem, 3vw, 2rem);

  &--compact { padding: 0; border: none; box-shadow: none; background: transparent; }

  &__form { display: flex; flex-direction: column; gap: 1rem; }

  &__row {
    display: grid;
    gap: 1rem;
    @media (min-width: 720px) { grid-template-columns: 1fr 1fr; }
  }

  &--compact &__row { @media (min-width: 720px) { grid-template-columns: 1fr 1fr; } }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    border: none;
    min-width: 0;

    > span,
    legend { font-weight: 700; font-size: 0.88rem; margin-bottom: 0.1rem; padding: 0; }

    input,
    textarea {
      width: 100%;
      padding: 0.75rem 0.9rem;
      border: var(--f-border);
      border-radius: calc(var(--f-radius) - 2px);
      background: var(--f-input);
      color: var(--f-ink);
      font: inherit;
      font-size: 1rem;
      resize: vertical;

      &::placeholder { color: var(--f-muted); opacity: 0.7; }
      &:focus { outline: 3px solid var(--f-focus); outline-offset: 1px; }
    }
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.85rem;
      border: var(--f-border);
      border-radius: 999px;
      background: var(--f-input);
      color: var(--f-ink);
      font: inherit;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease;

      &:hover { transform: translateY(-1px); }
      &.on { background: var(--f-chip-on); color: var(--f-accent-ink); }
    }

    &--small button { padding: 0.4rem 0.7rem; font-size: 0.8rem; }
  }

  &--classic &__chips button.on { color: #fff; }

  &__min {
    display: flex;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    border: 2px dashed #c9a227;
    border-radius: calc(var(--f-radius) - 2px);
    background: rgba(255, 225, 77, 0.16);

    > i { color: #e0a400; font-size: 1.2rem; margin-top: 0.15rem; }
    strong { display: block; font-size: 1rem; }
    p { font-size: 0.9rem; opacity: 0.85; margin: 0.15rem 0 0.6rem; }
  }

  &__accept {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-weight: 700;
    font-size: 0.92rem;
    cursor: pointer;

    input { width: 1.15rem; height: 1.15rem; accent-color: var(--f-accent); flex-shrink: 0; }
  }

  &__hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

  &__error {
    padding: 0.7rem 0.9rem;
    border-radius: 8px;
    background: rgba(229, 23, 63, 0.12);
    color: #c0112f;
    font-weight: 600;
  }

  &--classic &__error { color: #ff8fa3; }

  &__submit {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem 1rem;

    small { color: var(--f-muted); }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1.5rem;
    border: var(--f-border);
    border-radius: 999px;
    font: inherit;
    font-weight: 700;
    font-size: 1.02rem;
    color: var(--f-ink);
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover:not(:disabled) { transform: translateY(-2px); }
    &:disabled { opacity: 0.6; cursor: progress; }

    &--primary { background: var(--f-accent); color: var(--f-accent-ink); }
    &--wa { background: #3ddc97; color: #0d0d0d; }
    &--ig { background: #ff8fd0; color: #0d0d0d; }
  }

  &__done {
    text-align: center;
    padding: 1rem 0;

    h3 { font-family: var(--f-display); font-size: clamp(1.4rem, 3vw, 2rem); line-height: 1.15; margin: 0.5rem 0; }
    p { color: var(--f-muted); max-width: 30rem; margin: 0 auto 1.1rem; }
  }

  &__done-icon { font-size: 3.2rem; color: #10b981; display: inline-block; animation: lf-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

  &__quick { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; }

  &__ghost {
    margin-top: 1rem;
    background: none;
    border: none;
    color: var(--f-muted);
    text-decoration: underline;
    font: inherit;
    cursor: pointer;
  }
}

.lf-swap-enter-active, .lf-swap-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.lf-swap-enter-from, .lf-swap-leave-to { opacity: 0; transform: translateY(8px); }

@keyframes lf-pop { from { transform: scale(0.3) rotate(-20deg); } }
</style>
