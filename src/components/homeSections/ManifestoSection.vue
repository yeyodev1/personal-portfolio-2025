<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section id="manifesto" class="manifesto">
    <div class="manifesto__aside">
      <span class="tag manifesto__tag">{{ t('manifesto.tag') }}</span>
      <h2 class="manifesto__title">{{ t('manifesto.title') }}</h2>
      <p class="mono manifesto__label">{{ t('manifesto.originLabel') }}</p>
      <p class="manifesto__origin">{{ t('manifesto.origin') }}</p>
    </div>

    <div class="manifesto__body">
      <p class="manifesto__big">
        {{ t('manifesto.p1') }}<mark class="hl hl--yellow">{{ t('manifesto.p1Mark') }}</mark>
      </p>
      <p class="manifesto__big">
        {{ t('manifesto.p2') }}<mark class="hl hl--pink">{{ t('manifesto.p2Mark') }}</mark>{{ t('manifesto.p2End') }}
      </p>
      <p class="manifesto__small">{{ t('manifesto.p3') }}</p>

      <h3 class="manifesto__why">{{ t('manifesto.whyTitle') }}</h3>
      <p class="manifesto__small">{{ t('manifesto.why') }}</p>
      <p class="manifesto__closing">{{ t('manifesto.closing') }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.manifesto {
  max-width: 1440px;
  margin: 0 auto;
  padding: 5rem 1rem;
  border-top: 2px solid $ink;
  display: grid;
  gap: 3rem;

  @media (min-width: $breakpoint-md) { padding: 7rem 2rem; }
  @media (min-width: $breakpoint-lg) {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr);
    gap: 6rem;
    margin: 0 2rem;
  }
  @media (min-width: 1504px) { margin: 0 auto; }

  &__aside {
    @media (min-width: $breakpoint-lg) { position: sticky; top: 7rem; align-self: start; }
  }

  &__tag { background: $green; }

  &__title {
    font-size: clamp(3rem, 7vw, 5.5rem);
    line-height: 0.95;
    margin: 0.75rem 0 2rem;
  }

  &__label { margin-bottom: 0.6rem; }

  &__origin { color: #444; max-width: 26rem; font-size: 1rem; line-height: 1.55; }

  &__body { max-width: 46rem; }

  &__big {
    font-size: clamp(1.5rem, 3vw, 2.35rem);
    line-height: 1.22;
    letter-spacing: -0.01em;
    margin-bottom: 2.25rem;
  }

  &__small { font-size: clamp(1.1rem, 1.6vw, 1.3rem); line-height: 1.5; margin-bottom: 1.5rem; }

  &__why { font-size: clamp(1.8rem, 3.5vw, 2.6rem); margin: 3.5rem 0 1rem; }

  &__closing {
    display: inline-block;
    margin-top: 1.5rem;
    font-family: $font-hand;
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    color: $blue;
    transform: rotate(-2deg);
  }
}

.hl {
  color: inherit;
  padding: 0 0.1em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;

  &--yellow { background: $yellow; }
  &--pink { background: $pink; }
}
</style>
