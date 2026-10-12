<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { vSticker } from '@/composables/useStickers'
import { INSTAGRAM, WHATSAPP } from '@/data/links'
import diegoPhoto from '@/assets/fotos/diego.jpg'
import yoPhoto from '@/assets/fotos/yo.jpg'

const { t, tm } = useI18n()
const services = computed(() => tm('wall.services') as string[])
const nicoleFlow = computed(() => tm('wall.cases.nicole.poster') as string[])
const bolonChat = computed(() => tm('wall.cases.bolon.chat') as string[])
</script>

<template>
  <section id="work" class="wall">
    <header class="wall__head">
      <h2 class="wall__title">
        {{ t('wall.title') }} <span class="wall__count mono">· {{ t('wall.count') }}</span>
      </h2>
      <p class="wall__hint">
        <span class="wall__hint--fine">{{ t('wall.hint') }}</span>
        <span class="wall__hint--touch">{{ t('wall.hintTouch') }}</span>
      </p>
    </header>

    <div class="wall__grid">
      <!-- No. 01 · Courier Box -->
      <a href="https://courierboxlogistics.com" target="_blank" rel="noopener noreferrer" class="case case--big">
        <span class="case__no mono">No. 01</span>
        <img src="/work/courierbox.jpg" alt="courierboxlogistics.com" class="case__img" loading="lazy" />
        <div class="case__label">
          <span class="mono">{{ t('wall.cases.courier.label') }}</span>
          <h3>{{ t('wall.cases.courier.title') }}</h3>
          <p>{{ t('wall.cases.courier.metric') }}</p>
        </div>
      </a>

      <!-- CTA card -->
      <a :href="WHATSAPP" target="_blank" rel="noopener noreferrer" class="cta-card">
        <span class="cta-card__title">{{ t('wall.cta.title') }}</span>
        <span class="cta-card__avatar"><img :src="diegoPhoto" alt="Diego Reyes" /></span>
        <span class="cta-card__meta mono">{{ t('wall.cta.meta') }}</span>
      </a>

      <div class="cell">
        <div v-sticker="-3" class="name-tag name-tag--green">
          <div class="name-tag__head"><strong>{{ t('wall.hello') }}</strong><span>{{ t('wall.myNameIs') }}</span></div>
          <div class="name-tag__body">
            <img :src="diegoPhoto" alt="" />
            <span class="name-tag__name">Diego Reyes</span>
          </div>
          <span class="name-tag__role mono">{{ t('wall.roleMain') }}</span>
        </div>
      </div>

      <div class="cell">
        <a v-sticker="4" :href="INSTAGRAM" target="_blank" rel="noopener noreferrer" class="oval oval--pink">
          <span class="oval__hand">@yeyo.dev</span>
          <span class="mono oval__sub">Instagram</span>
        </a>
      </div>

      <!-- No. 02 · Nicole Pastry Arts -->
      <a href="https://nicole.com.ec" target="_blank" rel="noopener noreferrer" class="case case--big case--poster case--plum">
        <span class="case__no mono">No. 02</span>
        <ol class="case__flow">
          <li v-for="(step, i) in nicoleFlow" :key="step">
            <span class="mono">0{{ i + 1 }}</span>{{ step }}
          </li>
        </ol>
        <span class="case__inset"><img src="/work/nicole-pastry-arts.jpg" alt="" /></span>
        <div class="case__label">
          <span class="mono">{{ t('wall.cases.nicole.label') }}</span>
          <h3>{{ t('wall.cases.nicole.title') }}</h3>
          <p>{{ t('wall.cases.nicole.metric') }}</p>
        </div>
      </a>

      <div class="cell cell--wide">
        <div v-sticker="-1" class="specialty">
          <span class="mono specialty__label">{{ t('wall.specialtyLabel') }}</span>
          <strong class="specialty__title">{{ t('wall.specialtyTitle') }}</strong>
          <p>{{ t('wall.specialtyText') }}</p>
        </div>
      </div>

      <div class="cell">
        <div v-sticker="5" class="name-tag name-tag--red">
          <div class="name-tag__head"><strong>{{ t('wall.hello') }}</strong><span>{{ t('wall.myNameIs') }}</span></div>
          <div class="name-tag__body">
            <img :src="yoPhoto" alt="" />
            <span class="name-tag__name">Yeyo</span>
          </div>
          <span class="name-tag__role mono">{{ t('wall.roleAka') }}</span>
        </div>
      </div>

      <div class="cell cell--stack">
        <div v-sticker="-4" class="service service--green">
          <span class="mono">{{ t('wall.service') }}</span>{{ services[0] }}
        </div>
        <div v-sticker="3" class="service service--pink">
          <span class="mono">{{ t('wall.service') }}</span>{{ services[1] }}
        </div>
      </div>

      <!-- No. 03 · Boloncity -->
      <a href="https://boloncity.com" target="_blank" rel="noopener noreferrer" class="case case--big case--poster case--chat">
        <span class="case__no mono">No. 03</span>
        <ul class="case__chat" aria-hidden="true">
          <li v-for="(msg, i) in bolonChat" :key="i" :class="i % 2 ? 'bot' : 'me'">{{ msg }}</li>
        </ul>
        <div class="case__label">
          <span class="mono">{{ t('wall.cases.bolon.label') }}</span>
          <h3>{{ t('wall.cases.bolon.title') }}</h3>
          <p>{{ t('wall.cases.bolon.metric') }}</p>
        </div>
      </a>

      <div class="cell">
        <div v-sticker="-6" class="circle circle--ink">
          <strong>Bakano</strong><span class="mono">{{ t('wall.client') }}</span>
        </div>
      </div>

      <div class="cell">
        <div v-sticker="6" class="circle circle--green">
          <strong>Vue.js</strong><span class="mono">{{ t('wall.stack') }}</span>
        </div>
      </div>

      <div class="cell cell--stack">
        <div v-sticker="2" class="service service--yellow">
          <span class="mono">{{ t('wall.service') }}</span>{{ services[2] }}
        </div>
        <div v-sticker="-3" class="service service--orange">
          <span class="mono">{{ t('wall.service') }}</span>{{ services[3] }}
        </div>
      </div>

      <div class="cell">
        <div v-sticker="-2" class="quote">“{{ t('wall.quote') }}”</div>
      </div>

      <!-- No. 04 · Ponce's Rent a Car -->
      <a href="https://poncesrentacar.com.ec" target="_blank" rel="noopener noreferrer" class="case case--big">
        <span class="case__no mono">No. 04</span>
        <img src="/work/ponce-rent-a-car.jpg" alt="poncesrentacar.com.ec" class="case__img" loading="lazy" />
        <div class="case__label">
          <span class="mono">{{ t('wall.cases.ponce.label') }}</span>
          <h3>{{ t('wall.cases.ponce.title') }}</h3>
          <p>{{ t('wall.cases.ponce.metric') }}</p>
        </div>
      </a>

      <div class="cell">
        <div v-sticker="-5" class="service service--blue">
          <span class="mono">{{ t('wall.service') }}</span>{{ services[4] }}
        </div>
      </div>

      <div class="cell">
        <div v-sticker="4" class="oval oval--ink">
          <strong>Contifico</strong><span class="mono oval__sub">{{ t('wall.client') }}</span>
        </div>
      </div>

      <div class="cell">
        <div v-sticker="-3" class="circle circle--blue">
          <strong>Node.js</strong><span class="mono">{{ t('wall.stack') }}</span>
        </div>
      </div>

      <div class="cell">
        <div v-sticker="3" class="made-in">
          <i class="fa-solid fa-location-dot made-in__pin" aria-hidden="true" />{{ t('wall.madeIn') }}
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$sticker-edge: 0 0 0 3px $paper, 0 0 0 4px #dcdcdc, 0 8px 18px rgba(0, 0, 0, 0.1);

.wall {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  @media (min-width: $breakpoint-md) { padding: 2rem 2rem 5rem; }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 2rem;
    margin-bottom: 1.5rem;
  }

  &__title { font-size: clamp(2rem, 5vw, 3.5rem); }

  &__count { font-family: $font-mono; font-size: 0.85rem; vertical-align: middle; }

  &__hint {
    font-family: $font-hand;
    color: $blue;
    font-size: 1.15rem;
    transform: rotate(-2deg);

    &--touch { display: none; }
    @media (hover: none) {
      &--fine { display: none; }
      &--touch { display: inline; }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(170px, auto);
    grid-auto-flow: dense;
    gap: 0.75rem;

    @media (min-width: $breakpoint-lg) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-auto-rows: minmax(200px, auto);
    }
  }
}

.cell {
  display: grid;
  place-items: center;
  padding: 0.75rem;
  position: relative;

  &--wide { grid-column: span 2; }

  &--stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
  }
}

// ── Case cards ───────────────────────────────────────────────────────────────
.case {
  grid-column: span 2;
  grid-row: span 2;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  background: $cream;
  min-height: 360px;
  color: $ink;
  isolation: isolate;

  @media (min-width: $breakpoint-lg) { min-height: 410px; }

  &__no {
    position: absolute;
    top: 0.9rem;
    left: 0.9rem;
    z-index: 2;
    background: $paper;
    color: $ink;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.7rem;
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &:hover &__img { transform: scale(1.04); }

  &__label {
    position: absolute;
    left: 0.9rem;
    bottom: 0.9rem;
    right: 0.9rem;
    max-width: 26rem;
    z-index: 3;
    background: $paper;
    border-radius: 6px;
    padding: 0.8rem 1rem;
    color: $ink;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
    transform: rotate(-1deg);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    .mono { font-size: 0.66rem; color: $grey; display: block; }
    h3 { font-size: clamp(1.5rem, 3vw, 2.1rem); margin: 0.2rem 0 0.35rem; }
    p { font-size: 0.92rem; line-height: 1.3; border-top: 1px solid #e5e5e5; padding-top: 0.4rem; }
  }

  &:hover &__label { transform: rotate(0deg) translateY(-3px); }

  &--plum { background: #82286f; color: $paper; }
  &--chat { background: #e7f7ee; }

  &__flow {
    list-style: none;
    position: absolute;
    top: 3.5rem;
    left: 1.25rem;
    font-family: $font-display;
    font-size: clamp(1.6rem, 3.6vw, 2.8rem);
    line-height: 1.02;

    li { display: flex; align-items: baseline; gap: 0.6rem; }
    .mono { font-size: 0.7rem; color: $pink; }
  }

  &__inset {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: clamp(110px, 18vw, 160px);
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid $paper;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);

    img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.8); }
  }

  &__chat {
    list-style: none;
    position: absolute;
    top: 3.2rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;

    li {
      max-width: 78%;
      padding: 0.5rem 0.75rem;
      border-radius: 12px;
      font-size: clamp(0.85rem, 1.4vw, 1rem);
      line-height: 1.3;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.08);
    }

    .me { align-self: flex-end; background: #d9fdd3; border-bottom-right-radius: 3px; }
    .bot { align-self: flex-start; background: $paper; border-bottom-left-radius: 3px; }
  }
}

// ── CTA card (the "play the reel" moment) ───────────────────────────────────
.cta-card {
  grid-column: span 2;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  background: $orange;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 4.2vw, 3.6rem);
    line-height: 0.92;
    max-width: 8ch;
    position: relative;
    z-index: 1;
  }

  &__avatar {
    position: absolute;
    right: -1.5rem;
    top: 50%;
    width: clamp(150px, 20vw, 230px);
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    border: 5px solid $ink;
    transform: translateY(-50%) rotate(6deg);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

    img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
  }

  &:hover &__avatar { transform: translateY(-50%) rotate(-4deg) scale(1.05); }

  &__meta { font-size: 0.75rem; position: relative; z-index: 1; margin-top: 1rem; }
}

// ── Stickers ─────────────────────────────────────────────────────────────────
.name-tag {
  width: 158px;
  background: $paper;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: $sticker-edge;
  text-align: center;

  &__head {
    padding: 0.4rem 0.4rem 0.3rem;
    color: $paper;
    strong { display: block; font-family: $font-display; font-size: 1.05rem; line-height: 1; }
    span { font-family: $font-mono; font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; }
  }

  &--green &__head { background: $green; color: $ink; }
  &--red &__head { background: $red; }

  &__body {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.55rem 0.6rem 0.3rem;

    img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; object-position: center 25%; border: 2px solid $ink; }
  }

  &__name { font-family: $font-hand; font-size: 1.05rem; line-height: 1; text-align: left; }

  &__role { display: block; font-size: 0.52rem; padding: 0.2rem 0.4rem 0.55rem; color: $grey; }
}

.oval {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  padding: 1rem 1.4rem;
  border-radius: 999px;
  box-shadow: $sticker-edge;

  strong { font-family: $font-display; font-size: 1.15rem; line-height: 1; }
  &__hand { font-family: $font-hand; font-size: 1.45rem; line-height: 1; }
  &__sub { font-size: 0.55rem; margin-top: 0.3rem; }

  &--pink { background: $pink; }
  &--ink { background: $ink; color: $paper; }
}

.circle {
  width: 120px;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: $sticker-edge;

  strong { font-family: $font-display; font-size: 1.1rem; line-height: 1; }
  .mono { font-size: 0.5rem; margin-top: 0.3rem; }

  &--ink { background: $ink; color: $paper; strong { color: $red; } }
  &--green { background: $green; }
  &--blue { background: $blue; color: $paper; }
}

.service {
  width: 150px;
  padding: 0.7rem 0.85rem 0.9rem;
  border-radius: 6px;
  font-family: $font-body;
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.1;
  box-shadow: $sticker-edge;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);

  .mono { display: block; font-size: 0.52rem; font-weight: 400; margin-bottom: 0.45rem; opacity: 0.75; }

  &--green { background: $green; }
  &--pink { background: $pink; }
  &--yellow { background: $yellow; }
  &--orange { background: $orange; }
  &--blue { background: $blue; color: $paper; }
}

.specialty {
  max-width: 330px;
  background: $ink;
  color: $paper;
  border-radius: 8px;
  padding: 1rem 1.2rem 1.1rem;
  box-shadow: $sticker-edge;

  &__label { color: $yellow; font-size: 0.6rem; }
  &__title { display: block; font-family: $font-display; font-weight: 400; font-size: 1.65rem; line-height: 1.05; margin: 0.3rem 0 0.45rem; }
  p { font-size: 0.95rem; line-height: 1.3; }
}

.quote {
  max-width: 170px;
  background: $yellow;
  padding: 1rem;
  font-family: $font-hand;
  font-size: 1.25rem;
  line-height: 1.15;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  position: relative;

  // tape
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    width: 60px;
    height: 20px;
    background: rgba(255, 255, 255, 0.65);
    transform: translateX(-50%) rotate(-4deg);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }
}

.made-in {
  max-width: 170px;
  background: $paper;
  border: 2px dashed $ink;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-weight: 700;
  line-height: 1.2;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);

  &__pin { display: block; font-size: 1.3rem; color: $red; margin-bottom: 0.35rem; }
}
</style>
