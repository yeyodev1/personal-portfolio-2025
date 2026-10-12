<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { WHATSAPP } from '@/data/links'
import CdnImg from '@/components/shared/CdnImg.vue'

type Step = { title: string; text: string; desktop?: string; touch?: string }

const props = defineProps<{ open: boolean; touch: boolean }>()
const emit = defineEmits<{ close: []; goMuro: []; step: [n: number] }>()

const { t, tm } = useI18n()
const steps = computed(() => tm('select.guide.steps') as Step[])
const index = ref(0)
const step = computed(() => steps.value[index.value]!)
const isLast = computed(() => index.value === steps.value.length - 1)

watch(
  () => props.open,
  (open) => {
    if (open) index.value = 0
  },
)
watch([index, () => props.open], () => emit('step', props.open ? index.value : -1), { immediate: true })
</script>

<template>
  <Transition name="guide">
    <div v-if="open" class="guide" role="dialog" aria-modal="false" :aria-label="t('select.guide.who')">
      <!-- After the intro the backdrop lightens and lets clicks through so the visitor can pick a cartridge. -->
      <div class="guide__backdrop" :class="{ 'guide__backdrop--light': index > 0 }" @click="emit('close')" />
      <div class="guide__card">
        <div class="guide__head">
          <CdnImg src="/game/yeyo.jpg" :width="64" class="guide__avatar" eager />
          <div>
            <span class="guide__who">{{ t('select.guide.who') }}</span>
            <span class="guide__count">{{ t('select.guide.step', { n: index + 1, total: steps.length }) }}</span>
          </div>
          <button class="guide__x" :aria-label="t('select.guide.skip')" @click="emit('close')"><i class="fa-solid fa-xmark" /></button>
        </div>

        <h2 class="guide__title">{{ step.title }}</h2>
        <p class="guide__text">{{ step.text }}</p>
        <p v-if="step.desktop || step.touch" class="guide__how">
          <i :class="touch ? 'fa-solid fa-hand-pointer' : 'fa-solid fa-computer-mouse'" aria-hidden="true" />
          {{ touch ? step.touch : step.desktop }}
        </p>

        <div class="guide__dots" aria-hidden="true">
          <span v-for="(_, i) in steps" :key="i" :class="{ on: i === index }" />
        </div>

        <div v-if="isLast" class="guide__choices">
          <button class="guide__btn guide__btn--main" @click="emit('goMuro')">
            <i class="fa-solid fa-note-sticky" aria-hidden="true" /> {{ t('select.guide.goMuro') }}
          </button>
          <a :href="WHATSAPP" target="_blank" rel="noopener noreferrer" class="guide__btn guide__btn--wa">
            <i class="fa-brands fa-whatsapp" aria-hidden="true" /> {{ t('select.guide.goWhatsapp') }}
          </a>
        </div>

        <div class="guide__nav">
          <button v-if="index > 0" class="guide__link" @click="index--">
            <i class="fa-solid fa-arrow-left" aria-hidden="true" /> {{ t('select.guide.back') }}
          </button>
          <button v-else class="guide__link" @click="emit('close')">{{ t('select.guide.skip') }}</button>
          <button v-if="!isLast" class="guide__btn" @click="index++">
            {{ t('select.guide.next') }} <i class="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
          <button v-else class="guide__link" @click="emit('close')">{{ t('select.guide.skip') }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
$pixel: 'Press Start 2P', ui-monospace, monospace;

.guide {
  position: fixed;
  inset: 0;
  z-index: 90;
  pointer-events: none;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(5, 4, 15, 0.55);
    pointer-events: auto;
    transition: background 0.3s ease;

    &--light { background: rgba(5, 4, 15, 0.15); pointer-events: none; }
  }

  &__card {
    position: absolute;
    left: 50%;
    bottom: 1rem;
    width: min(440px, calc(100% - 2rem));
    transform: translateX(-50%);
    pointer-events: auto;
    background: #fffdf6;
    color: #111;
    border: 3px solid #000;
    border-radius: 16px;
    box-shadow: 6px 6px 0 #000;
    padding: 1.1rem 1.2rem 1rem;

    @media (min-width: 761px) {
      left: auto;
      right: 1.5rem;
      bottom: 1.5rem;
      transform: none;
    }
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 0.7rem;

    > div { display: flex; flex-direction: column; flex: 1; }
  }

  &__avatar {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    border: 3px solid #000;
    object-fit: cover;
    background: #5ec4bb;
    animation: wave 1.6s ease-in-out 2;
  }

  &__who { font-weight: 700; }
  &__count { font-family: $font-mono; font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.08em; }

  &__x {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 2px solid #000;
    background: #fff;
    cursor: pointer;
  }

  &__title { font-family: $pixel; font-size: 0.85rem; line-height: 1.5; margin: 0.9rem 0 0.5rem; }

  &__text { font-size: 1rem; line-height: 1.5; }

  &__how {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    margin-top: 0.7rem;
    padding: 0.65rem 0.8rem;
    background: #fff4c2;
    border: 2px dashed #b8941a;
    border-radius: 10px;
    font-size: 0.95rem;
    line-height: 1.45;

    i { color: #ff7a1a; margin-top: 0.2rem; }
  }

  &__dots {
    display: flex;
    gap: 6px;
    margin: 0.9rem 0 0.6rem;

    span { width: 8px; height: 8px; border-radius: 50%; background: #ccc; transition: all 0.3s ease; }
    span.on { width: 22px; border-radius: 4px; background: #ff7a1a; }
  }

  &__choices { display: flex; flex-direction: column; gap: 0.5rem; margin: 0.4rem 0 0.6rem; }

  &__nav { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.7rem 1.1rem;
    border: 3px solid #000;
    border-radius: 999px;
    background: $yellow;
    color: #111;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 0 #000;
    transition: transform 0.15s ease;

    &:hover { transform: translateY(-2px); }

    &--main { background: #ff7a1a; }
    &--wa { background: #3ddc97; }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: none;
    color: #555;
    font: inherit;
    font-size: 0.9rem;
    text-decoration: underline;
    cursor: pointer;
  }
}

.guide-enter-active, .guide-leave-active { transition: opacity 0.3s ease; }
.guide-enter-active .guide__card, .guide-leave-active .guide__card { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.guide-enter-from, .guide-leave-to { opacity: 0; }
.guide-enter-from .guide__card { transform: translate(-50%, 40px); }

@media (min-width: 761px) {
  .guide-enter-from .guide__card { transform: translateY(40px); }
}

@keyframes wave {
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(8deg); }
}
</style>
