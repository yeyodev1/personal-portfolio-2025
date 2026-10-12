<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useArcade } from '@/composables/useArcade'

const { t } = useI18n()
const { blip } = useArcade()
</script>

<template>
  <RouterLink to="/" class="vswitch" @click="blip">
    <i class="fa-solid fa-gamepad" aria-hidden="true" /> {{ t('switcher') }}
  </RouterLink>
</template>

<style lang="scss" scoped>
.vswitch {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  z-index: 95;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: #111;
  color: #fff !important;
  font-family: 'DM Mono', ui-monospace, monospace;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 2px solid #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  i { color: #ffe14d; }

  &:hover { transform: translateX(-50%) translateY(-3px) rotate(-2deg); }
}
</style>
