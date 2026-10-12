<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CdnImg from '@/components/shared/CdnImg.vue'
import { CATEGORIES, PROJECTS, categoryOf, projectImage, type Category } from '@/data/projects'

export type Theme = 'stickers' | 'classic' | 'game'
const props = withDefaults(defineProps<{ initial?: number; theme?: Theme }>(), { initial: 9, theme: 'stickers' })

const { t, locale } = useI18n()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'es'))
const active = ref<Category | 'all'>('all')
const expanded = ref(false)

const filtered = computed(() => (active.value === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === active.value)))
const visible = computed(() => (expanded.value ? filtered.value : filtered.value.slice(0, props.initial)))
const countOf = (id: Category) => PROJECTS.filter((p) => p.category === id).length
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

const broken = ref(new Set<string>())
const pick = (id: Category | 'all') => {
  active.value = id
  expanded.value = false
}
</script>

<template>
  <div class="px" :class="`px--${theme}`">
    <div class="px__tabs" role="tablist">
      <button role="tab" :aria-selected="active === 'all'" :class="{ on: active === 'all' }" @click="pick('all')">
        {{ t('portfolio.all') }} <span>{{ PROJECTS.length }}</span>
      </button>
      <button
        v-for="cat in CATEGORIES"
        :key="cat.id"
        role="tab"
        :aria-selected="active === cat.id"
        :class="{ on: active === cat.id }"
        @click="pick(cat.id)"
      >
        <i :class="cat.icon" :style="{ color: active === cat.id ? 'inherit' : cat.color }" aria-hidden="true" />
        {{ cat.label[lang] }} <span>{{ countOf(cat.id) }}</span>
      </button>
    </div>

    <p v-if="active !== 'all'" class="px__pitch">{{ CATEGORIES.find((c) => c.id === active)?.pitch[lang] }}</p>

    <TransitionGroup tag="ul" name="px" class="px__grid">
      <li v-for="p in visible" :key="p.slug" class="px__card">
        <component :is="p.url ? 'a' : 'div'" :href="p.url" target="_blank" rel="noopener noreferrer" class="px__media">
          <CdnImg v-if="!broken.has(p.slug)" :src="projectImage(p)" :width="480" :alt="p.name" @failed="broken.add(p.slug)" />
          <span v-else class="px__fallback" :style="{ '--cat': categoryOf(p).color }" aria-hidden="true">
            <i :class="categoryOf(p).icon" />
            <b>{{ p.name }}</b>
          </span>
          <span class="px__badge">
            <i :class="categoryOf(p).icon" :style="{ color: categoryOf(p).color }" aria-hidden="true" />
            {{ categoryOf(p).label[lang] }}
          </span>
        </component>
        <div class="px__body">
          <p class="px__meta">{{ p.industry[lang] }} · {{ p.place }}</p>
          <h3 class="px__name">{{ p.name }}</h3>
          <p class="px__desc">{{ p.desc[lang] }}</p>
          <ul class="px__chips">
            <li v-for="chip in p.chips" :key="chip.es">{{ chip[lang] }}</li>
          </ul>
          <a v-if="p.url" :href="p.url" target="_blank" rel="noopener noreferrer" class="px__link">
            {{ host(p.url) }} ↗
          </a>
          <span v-else class="px__link px__link--muted">{{ t('portfolio.internal') }}</span>
        </div>
      </li>
    </TransitionGroup>

    <button v-if="filtered.length > initial" class="px__more" @click="expanded = !expanded">
      {{ expanded ? t('portfolio.showLess') : t('portfolio.showAll', { n: filtered.length }) }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.px {
  --x-ink: #0d0d0d;
  --x-muted: #5c5c5c;
  --x-card: #fff;
  --x-border: 2px solid #0d0d0d;
  --x-radius: 10px;
  --x-accent: #ffe14d;
  --x-accent-ink: #0d0d0d;
  --x-chip: #f3ecdc;
  --x-shadow: 4px 4px 0 #0d0d0d;
  --x-display: 'Bowlby One', sans-serif;
  color: var(--x-ink);

  &--classic {
    --x-ink: #f1f5f9;
    --x-muted: #94a3b8;
    --x-card: #0d0d22;
    --x-border: 1px solid rgba(124, 58, 237, 0.28);
    --x-radius: 16px;
    --x-accent: #7c3aed;
    --x-accent-ink: #fff;
    --x-chip: rgba(124, 58, 237, 0.16);
    --x-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    --x-display: 'Roboto', sans-serif;
  }

  &--game {
    --x-ink: #1f2a2c;
    --x-muted: #5d6b6d;
    --x-card: #fffdf6;
    --x-border: 3px solid #1f2a2c;
    --x-radius: 14px;
    --x-accent: #e9b949;
    --x-accent-ink: #1f2a2c;
    --x-chip: #e3efe9;
    --x-shadow: 4px 4px 0 #1f2a2c;
    --x-display: 'Bungee', sans-serif;
  }

  &__tabs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.25rem 0.1rem 0.75rem;
    scrollbar-width: none;

    button {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.55rem 1rem;
      border: var(--x-border);
      border-radius: 999px;
      background: var(--x-card);
      color: var(--x-ink);
      font: inherit;
      font-weight: 600;
      font-size: 0.92rem;
      cursor: pointer;
      transition: transform 0.2s ease;

      span { font-size: 0.75rem; opacity: 0.6; }
      &:hover { transform: translateY(-2px); }
      &.on { background: var(--x-accent); color: var(--x-accent-ink); span { opacity: 0.85; } }
    }
  }

  &__pitch { color: var(--x-muted); margin: 0.25rem 0 1rem; font-size: 1.05rem; }

  &__grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 290px), 1fr));
    gap: 1.1rem;
    margin-top: 0.75rem;
  }

  &__card {
    display: flex;
    flex-direction: column;
    background: var(--x-card);
    border: var(--x-border);
    border-radius: var(--x-radius);
    box-shadow: var(--x-shadow);
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover { transform: translateY(-4px); }
  }

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 16 / 10;
    background: linear-gradient(135deg, var(--x-chip), var(--x-accent));
    overflow: hidden;

    img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform 0.5s ease; }
  }

  &__card:hover &__media img { transform: scale(1.04); }

  &__fallback {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 1rem;
    text-align: center;
    background:
      radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--cat) 35%, transparent), transparent 60%),
      color-mix(in srgb, var(--cat) 14%, var(--x-card));

    i { font-size: 2.6rem; color: var(--cat); }
    b { font-family: var(--x-display); font-size: 1.05rem; color: var(--x-ink); opacity: 0.85; }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    position: absolute;
    left: 0.6rem;
    bottom: 0.6rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.72);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 600;
    backdrop-filter: blur(4px);
  }

  &__body { display: flex; flex-direction: column; gap: 0.45rem; padding: 0.95rem 1rem 1rem; flex: 1; }

  &__meta { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--x-muted); }

  &__name { font-family: var(--x-display); font-size: 1.3rem; line-height: 1.1; }

  &__desc { font-size: 0.95rem; line-height: 1.45; color: var(--x-ink); opacity: 0.88; }

  &__chips {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.15rem;

    li { font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 999px; background: var(--x-chip); color: var(--x-ink); }
  }

  &__link {
    margin-top: auto;
    padding-top: 0.5rem;
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--x-ink);
    text-decoration: underline;
    text-underline-offset: 3px;

    &--muted { text-decoration: none; opacity: 0.55; font-weight: 500; }
  }

  &__more {
    display: block;
    margin: 1.75rem auto 0;
    padding: 0.8rem 1.6rem;
    border: var(--x-border);
    border-radius: 999px;
    background: var(--x-accent);
    color: var(--x-accent-ink);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    box-shadow: var(--x-shadow);
  }
}

.px-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.px-enter-from { opacity: 0; transform: translateY(10px); }
</style>
