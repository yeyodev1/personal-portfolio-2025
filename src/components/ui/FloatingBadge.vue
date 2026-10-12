<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStickers } from '@/composables/useStickers'

const { t } = useI18n()
const { tidyUp, movedCount } = useStickers()
</script>

<template>
  <div class="badge-dock">
    <a href="/muro#contact" class="badge" :aria-label="t('nav.sayHello')">
      <svg viewBox="0 0 200 200" class="badge__ring" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="488">{{ t('badge.ring').repeat(2) }}</textPath>
        </text>
      </svg>
      <span class="badge__center">{{ t('badge.center') }}</span>
    </a>
    <Transition name="pop">
      <button v-if="movedCount > 0" class="pill-btn badge-dock__tidy" @click="tidyUp">
        <i class="fa-solid fa-broom" style="color: #ff7a1a" aria-hidden="true" /> {{ t('badge.tidy') }}
      </button>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.badge-dock {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;

  @media (min-width: $breakpoint-md) { right: 1.75rem; bottom: 1.75rem; }

  &__tidy { padding: 0.45rem 0.95rem; font-size: 0.9rem; }
}

.badge {
  position: relative;
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: $yellow;
  box-shadow: 0 0 0 3px $paper, 0 0 0 4px #ddd, 0 10px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  @media (min-width: $breakpoint-md) { width: 140px; height: 140px; }

  &:hover { transform: scale(1.08) rotate(-6deg); }

  &__ring {
    position: absolute;
    inset: 0;
    animation: spin 18s linear infinite;

    text {
      font-family: $font-mono;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      fill: $ink;
    }
  }

  &__center {
    display: grid;
    place-items: center;
    width: 58%;
    height: 58%;
    border-radius: 50%;
    background: $ink;
    color: $yellow;
    font-family: $font-display;
    font-size: clamp(0.7rem, 1.6vw, 1.2rem);
    line-height: 0.95;
    text-align: center;
    white-space: pre-line;
  }
}

@keyframes spin { to { transform: rotate(360deg); } }

.pop-enter-active, .pop-leave-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s; }
.pop-enter-from, .pop-leave-to { transform: scale(0.6); opacity: 0; }
</style>
