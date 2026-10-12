<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// Every link to Yeyo's WhatsApp (in any world) first asks the visitor to confirm the $500 minimum.
const NUMBER = '593963681303'
const ACK_KEY = 'yeyo:wa-500'

const { t } = useI18n()
const open = ref(false)
const accepted = ref(false)
let pendingHref = ''

const acknowledged = () => {
  try {
    return sessionStorage.getItem(ACK_KEY) === '1'
  } catch {
    return false
  }
}

const onClick = (e: MouseEvent) => {
  const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!link || !link.href.includes(`wa.me/${NUMBER}`) || acknowledged()) return
  e.preventDefault()
  e.stopPropagation()
  pendingHref = link.href
  accepted.value = false
  open.value = true
}

const go = () => {
  if (!accepted.value) return
  try {
    sessionStorage.setItem(ACK_KEY, '1')
  } catch {
    /* ignore */
  }
  open.value = false
  window.open(pendingHref, '_blank', 'noopener')
}

const onKey = (e: KeyboardEvent) => {
  if (open.value && e.key === 'Escape') open.value = false
}

// Capture phase: runs before any component handler or the browser follows the link.
onMounted(() => {
  document.addEventListener('click', onClick, true)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClick, true)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Transition name="wa">
    <div v-if="open" class="wa" role="dialog" aria-modal="true" :aria-label="t('wa.title')" @click.self="open = false">
      <div class="wa__card">
        <span class="wa__icon" aria-hidden="true"><i class="fa-brands fa-whatsapp" /></span>
        <h2>{{ t('wa.title') }}</h2>
        <p>{{ t('wa.text') }}</p>
        <label class="wa__check">
          <input v-model="accepted" type="checkbox" />
          <span>{{ t('wa.accept') }}</span>
        </label>
        <p class="wa__note"><i class="fa-solid fa-circle-info" aria-hidden="true" /> {{ t('wa.note') }}</p>
        <div class="wa__actions">
          <button class="wa__go" :disabled="!accepted" @click="go">
            <i class="fa-brands fa-whatsapp" aria-hidden="true" /> {{ t('wa.go') }}
          </button>
          <button class="wa__cancel" @click="open = false">{{ t('wa.cancel') }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.wa {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(10, 10, 20, 0.6);
  font-family: 'Instrument Sans', system-ui, sans-serif;

  &__card {
    width: min(420px, 100%);
    background: #fff;
    color: #111;
    border: 3px solid #111;
    border-radius: 18px;
    box-shadow: 6px 6px 0 #111;
    padding: 1.4rem 1.3rem 1.2rem;
    text-align: left;

    h2 { font-family: 'Bowlby One', sans-serif; font-weight: 400; font-size: 1.35rem; line-height: 1.1; margin: 0.7rem 0 0.5rem; }
    p { font-size: 0.98rem; line-height: 1.5; color: #333; }
  }

  &__icon {
    display: inline-grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 14px;
    background: #3ddc97;
    border: 2px solid #111;
    font-size: 1.6rem;
  }

  &__check {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
    margin-top: 1rem;
    padding: 0.8rem 0.9rem;
    background: #fff6d6;
    border: 2px dashed #c9a227;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.95rem;
    line-height: 1.4;
    cursor: pointer;

    input { width: 1.2rem; height: 1.2rem; margin-top: 0.1rem; accent-color: #16a34a; flex-shrink: 0; }
  }

  &__note { margin-top: 0.7rem; font-size: 0.85rem !important; color: #666 !important; i { color: #c9a227; } }

  &__actions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }

  &__go {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1rem;
    border: 3px solid #111;
    border-radius: 999px;
    background: #3ddc97;
    color: #111;
    font: inherit;
    font-weight: 800;
    font-size: 1.02rem;
    cursor: pointer;
    box-shadow: 0 4px 0 #111;

    &:disabled { background: #ddd; color: #888; box-shadow: none; cursor: not-allowed; }
  }

  &__cancel { background: none; border: none; font: inherit; color: #666; text-decoration: underline; cursor: pointer; }
}

.wa-enter-active, .wa-leave-active { transition: opacity 0.2s ease; }
.wa-enter-from, .wa-leave-to { opacity: 0; }
</style>
