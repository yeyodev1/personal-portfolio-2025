<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Line {
  type: 'cmd' | 'out' | 'err' | 'success' | 'accent' | 'dim' | 'blank'
  text: string
}

const isOpen      = ref(false)
const input       = ref('')
const lines       = ref<Line[]>([])
const bodyRef     = ref<HTMLElement | null>(null)
const inputRef    = ref<HTMLInputElement | null>(null)
const isTyping    = ref(false)

// ── Command history ──────────────────────────────────────────────────────────
const history     = ref<string[]>([])
const histIdx     = ref(-1)

// ── Commands registry ────────────────────────────────────────────────────────
const COMMANDS: Record<string, { hint: string; run: () => Line[] }> = {
  help: {
    hint: 'list available commands',
    run: () => [
      { type: 'accent', text: '  Available commands' },
      { type: 'dim',    text: '  ─────────────────────────────────────────' },
      { type: 'out',    text: '  whoami        — who is this guy?' },
      { type: 'out',    text: '  skills        — tech stack & proficiency' },
      { type: 'out',    text: '  experience    — professional timeline' },
      { type: 'out',    text: '  projects      — featured work' },
      { type: 'out',    text: '  contact       — get in touch' },
      { type: 'out',    text: '  achievements  — stats & highlights' },
      { type: 'out',    text: '  git log       — commit history (fun version)' },
      { type: 'out',    text: '  sudo hire me  — make a great decision' },
      { type: 'out',    text: '  clear         — clear terminal' },
      { type: 'out',    text: '  exit          — close terminal' },
      { type: 'blank',  text: '' },
      { type: 'dim',    text: '  ↑ ↓  navigate history  |  Tab  autocomplete' },
    ],
  },

  whoami: {
    hint: 'who is this guy?',
    run: () => [
      { type: 'accent',  text: '  Diego Reyes  ·  aka Yeyo' },
      { type: 'dim',     text: '  ─────────────────────────────────────────' },
      { type: 'out',     text: '  Role      : CTO @ Bakano · Full Stack Dev · AI Trainer' },
      { type: 'out',     text: '  Location  : Ecuador (EC) — available worldwide' },
      { type: 'out',     text: '  Experience: 6+ years building production systems' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  I read businesses like code —' },
      { type: 'out',     text: '  walk in, observe the team, and map the entire' },
      { type: 'out',     text: '  system in my head before writing line one.' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  Scale AI  : Early AI trainer · GPT-3 & GPT-3.5 datasets' },
      { type: 'success', text: '  Bakano    : Built & lead the tech team from day 1' },
      { type: 'success', text: '  Finestra  : SaaS for pastry studios — prod since 2024' },
    ],
  },

  skills: {
    hint: 'tech stack & proficiency',
    run: () => [
      { type: 'accent', text: '  Tech Stack' },
      { type: 'dim',    text: '  ─────────────────────────────────────────' },
      { type: 'out',    text: '  Vue 3 / Nuxt      ██████████████████  98%' },
      { type: 'out',    text: '  TypeScript        █████████████████░  92%' },
      { type: 'out',    text: '  Node.js / Express ████████████████░░  88%' },
      { type: 'out',    text: '  PostgreSQL / SQL  ███████████████░░░  82%' },
      { type: 'out',    text: '  Python            ██████████████░░░░  78%' },
      { type: 'out',    text: '  Docker / CI-CD    █████████████░░░░░  74%' },
      { type: 'blank',  text: '' },
      { type: 'accent', text: '  Also fluent in' },
      { type: 'out',    text: '  SCSS · Tailwind · Vite · Pinia · REST · WebSockets' },
      { type: 'out',    text: '  Spline · Three.js · Figma → code workflows' },
    ],
  },

  experience: {
    hint: 'professional timeline',
    run: () => [
      { type: 'accent',  text: '  Professional Timeline' },
      { type: 'dim',     text: '  ─────────────────────────────────────────' },
      { type: 'success', text: '  2024 → now   CTO · Bakano' },
      { type: 'out',     text: '               Built the product from zero.' },
      { type: 'out',     text: '               Led team, architected the stack,' },
      { type: 'out',     text: '               delivered in 3 days.' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  2024 → now   Finestra SaaS' },
      { type: 'out',     text: '               Order mgmt → production → dispatch' },
      { type: 'out',     text: '               → delivery → warehouse. Contifico billing.' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  2023 → 2025  AI Trainer · Scale AI' },
      { type: 'out',     text: '               One of the first teams. Wrote Python,' },
      { type: 'out',     text: '               JS & TS code to shape GPT-3 / GPT-3.5.' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  2024         Opus Dental Lab' },
      { type: 'out',     text: '               Full dental-lab management app.' },
      { type: 'out',     text: '               Design → production in 5 days.' },
      { type: 'blank',   text: '' },
      { type: 'dim',     text: '  3 402 commits  ·  4 countries  ·  15+ projects' },
    ],
  },

  projects: {
    hint: 'featured work',
    run: () => [
      { type: 'accent',  text: '  Featured Projects' },
      { type: 'dim',     text: '  ─────────────────────────────────────────' },
      { type: 'success', text: '  Finestra — Pastry Studio SaaS' },
      { type: 'out',     text: '  Vue 3 · Node · PostgreSQL · Contifico' },
      { type: 'out',     text: '  Full order lifecycle in production' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  Bakano — Digital Agency Platform' },
      { type: 'out',     text: '  Vue 3 · TypeScript · Vite · SCSS' },
      { type: 'out',     text: '  Shipped in 3 days as CTO' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  Opus Dental Lab — Lab Management' },
      { type: 'out',     text: '  Full workflow: orders → production → delivery' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  Scale AI — GPT Training Datasets' },
      { type: 'out',     text: '  Python · TypeScript · original code, no copy-paste' },
    ],
  },

  contact: {
    hint: 'get in touch',
    run: () => [
      { type: 'accent',  text: '  Let\'s build something' },
      { type: 'dim',     text: '  ─────────────────────────────────────────' },
      { type: 'out',     text: '  WhatsApp  : +1 (763) 352-4852' },
      { type: 'out',     text: '  Email     : diego@yeyo.dev' },
      { type: 'out',     text: '  GitHub    : github.com/yeyodev1' },
      { type: 'out',     text: '  LinkedIn  : linkedin.com/in/yeyodev' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  Ecuador (EC) · respond within a few hours' },
      { type: 'out',     text: '  Available for projects · consulting · full-time' },
    ],
  },

  achievements: {
    hint: 'stats & highlights',
    run: () => [
      { type: 'accent',  text: '  Stats' },
      { type: 'dim',     text: '  ─────────────────────────────────────────' },
      { type: 'out',     text: '  Commits        3 402' },
      { type: 'out',     text: '  Years exp       6+' },
      { type: 'out',     text: '  Countries        4  (EC · MX · US · remote)' },
      { type: 'out',     text: '  Projects        15+' },
      { type: 'out',     text: '  Coffees          ∞' },
      { type: 'blank',   text: '' },
      { type: 'accent',  text: '  Highlights' },
      { type: 'success', text: '  [+]  One of first AI trainers on GPT-3 team' },
      { type: 'success', text: '  [+]  CTO & product built in 3 days' },
      { type: 'success', text: '  [+]  SaaS in production serving real businesses' },
      { type: 'success', text: '  [+]  Maps entire business systems by observation' },
    ],
  },

  'git log': {
    hint: 'commit history',
    run: () => [
      { type: 'accent', text: '  git log --oneline --graph' },
      { type: 'dim',    text: '  ─────────────────────────────────────────' },
      { type: 'success',text: '  * a1b2c3  feat: ship portfolio v3 — Spline robot + timeline' },
      { type: 'out',    text: '  * d4e5f6  feat: CTO mode activated @ Bakano' },
      { type: 'out',    text: '  * 7g8h9i  feat: add Scale AI GPT-3.5 training dataset' },
      { type: 'out',    text: '  * j0k1l2  feat: Finestra SaaS goes live in production' },
      { type: 'out',    text: '  * m3n4o5  feat: Opus Dental Lab — design to prod in 5d' },
      { type: 'out',    text: '  * p6q7r8  fix: business logic — read 3 companies by lunch' },
      { type: 'out',    text: '  * s9t0u1  chore: relocate Ecuador -> world stage' },
      { type: 'dim',    text: '' },
      { type: 'dim',    text: '  3 402 commits and counting...' },
    ],
  },

  'sudo hire me': {
    hint: '',
    run: () => [
      { type: 'dim',     text: '  [sudo] password for recruiter:  ........' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  Access granted.' },
      { type: 'blank',   text: '' },
      { type: 'accent',  text: '  Executing: hire --candidate="Diego Reyes" --level=senior' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  Checking availability ............. OPEN' },
      { type: 'out',     text: '  Checking skills ................... EXCEPTIONAL' },
      { type: 'out',     text: '  Checking business instinct ........ OFF THE CHARTS' },
      { type: 'out',     text: '  Checking team impact .............. HIGH' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  Result: Best decision you\'ll make this quarter.' },
      { type: 'dim',     text: '  -> WhatsApp: +1 (763) 352-4852' },
    ],
  },
}

const ALL_CMDS = Object.keys(COMMANDS)

// ── Helpers ──────────────────────────────────────────────────────────────────
const scrollBottom = () => nextTick(() => {
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
})

const push = (l: Line) => { lines.value.push(l); scrollBottom() }

const typeLines = async (ls: Line[], delay = 12) => {
  isTyping.value = true
  for (const l of ls) {
    push(l)
    await new Promise(r => setTimeout(r, l.type === 'blank' ? 0 : delay))
  }
  isTyping.value = false
}

// ── Command execution ────────────────────────────────────────────────────────
const run = async (raw: string) => {
  const cmd = raw.trim().toLowerCase()
  push({ type: 'cmd', text: `yeyo@portfolio:~$ ${raw.trim()}` })

  if (!cmd) return

  if (cmd === 'clear') { lines.value = []; return }
  if (cmd === 'exit')  { isOpen.value = false; return }

  const def = COMMANDS[cmd]
  if (def) {
    await typeLines(def.run())
  } else {
    push({ type: 'err',  text: `  command not found: ${cmd}` })
    push({ type: 'dim',  text: '  type "help" for available commands' })
  }
  push({ type: 'blank', text: '' })
}

// ── Input handling ───────────────────────────────────────────────────────────
const onKeydown = async (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !isTyping.value) {
    const val = input.value
    if (val.trim()) { history.value.unshift(val); histIdx.value = -1 }
    input.value = ''
    await run(val)
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    histIdx.value = Math.min(histIdx.value + 1, history.value.length - 1)
    input.value = history.value[histIdx.value] ?? ''
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    histIdx.value = Math.max(histIdx.value - 1, -1)
    input.value = histIdx.value >= 0 ? (history.value[histIdx.value] ?? '') : ''
    return
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    const partial = input.value.toLowerCase()
    const match   = ALL_CMDS.find(c => c.startsWith(partial) && c !== partial)
    if (match) input.value = match
    return
  }
}

// ── Open / close ─────────────────────────────────────────────────────────────
const open = async () => {
  isOpen.value = true
  if (lines.value.length === 0) {
    await nextTick()
    await typeLines([
      { type: 'accent',  text: '  yeyo.dev  —  interactive terminal  v3' },
      { type: 'dim',     text: '  ─────────────────────────────────────────' },
      { type: 'out',     text: '  Hey dev — you found the terminal. Nice.' },
      { type: 'out',     text: '  Type "help" to see what you can do here.' },
      { type: 'blank',   text: '' },
    ], 8)
  }
  await nextTick()
  inputRef.value?.focus()
}

const close = () => { isOpen.value = false }

// ── Keyboard shortcut: Ctrl+` ────────────────────────────────────────────────
const onGlobalKey = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === '`') { isOpen.value ? close() : open() }
}

onMounted(() => document.addEventListener('keydown', onGlobalKey))
onUnmounted(() => document.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <div class="dt">

    <!-- ── Trigger button ───────────────────────────────────────────────── -->
    <Transition name="dt-pop">
      <button v-if="!isOpen" class="dt__trigger" @click="open" aria-label="Open terminal">
        <i class="fa-solid fa-terminal dt__trigger-icon" />
        <span class="dt__trigger-label">Terminal</span>
        <kbd class="dt__trigger-kbd">^`</kbd>
      </button>
    </Transition>

    <!-- ── Terminal window ──────────────────────────────────────────────── -->
    <Transition name="dt-slide">
      <div v-if="isOpen" class="dt__backdrop" @click.self="close">
        <div class="dt__window">

          <!-- Title bar -->
          <div class="dt__bar">
            <div class="dt__dots">
              <button class="dt__dot dt__dot--red"    @click="close"   aria-label="close" />
              <button class="dt__dot dt__dot--yellow" aria-label="minimize" />
              <button class="dt__dot dt__dot--green"  aria-label="maximize" />
            </div>
            <span class="dt__bar-title">yeyo@portfolio — bash</span>
            <span class="dt__bar-hint">ctrl+` to toggle</span>
          </div>

          <!-- Output area -->
          <div ref="bodyRef" class="dt__body" @click="inputRef?.focus()">
            <div
              v-for="(line, i) in lines"
              :key="i"
              class="dt__line"
              :class="`dt__line--${line.type}`"
            >{{ line.text }}</div>

            <!-- Active input row -->
            <div class="dt__input-row">
              <span class="dt__ps1">yeyo@portfolio:~$&nbsp;</span>
              <input
                ref="inputRef"
                v-model="input"
                class="dt__input"
                @keydown="onKeydown"
                autocomplete="off"
                spellcheck="false"
                :disabled="isTyping"
                aria-label="terminal input"
              />
              <span class="dt__caret" :class="{ 'dt__caret--pause': isTyping }" />
            </div>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<style lang="scss" scoped>
// ── Layout shell ─────────────────────────────────────────────────────────────
.dt {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 9999;

  @media (max-width: 1023px) { display: none; }
}

// ── Trigger ───────────────────────────────────────────────────────────────────
.dt__trigger {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  background: $ink;
  border: 2px solid $ink;
  border-radius: 999px;
  color: $green;
  font-family: $font-mono;
  font-size: 0.78rem;
  cursor: pointer;
  box-shadow: 0 0 0 3px $paper, 0 8px 18px rgba(0, 0, 0, 0.15);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: translateY(-2px) rotate(-2deg);
    color: $yellow;
    .dt__trigger-bar { background: $yellow; }
  }
}

.dt__trigger-icon {
  font-size: 0.9rem;
  color: inherit;
  transition: color 0.25s;
  .dt__trigger:hover & { color: $text-primary; }
}

.dt__trigger-label {
  margin-left: 0.25rem;
  letter-spacing: 0.05em;
}

.dt__trigger-kbd {
  margin-left: 0.25rem;
  padding: 0.1rem 0.35rem;
  border: 1px solid $border-violet;
  border-radius: 4px;
  font-size: 0.7rem;
  color: $text-muted;
  font-family: inherit;
}

// ── Backdrop ─────────────────────────────────────────────────────────────────
.dt__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 2, 8, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 9999;
}

// ── Window ────────────────────────────────────────────────────────────────────
.dt__window {
  width: 100%;
  max-width: 780px;
  max-height: 72vh;
  display: flex;
  flex-direction: column;
  background: #06060f;
  border: 1px solid $border-violet;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(124,58,237,0.1),
    0 32px 80px rgba(0,0,0,0.7),
    0 0 60px rgba(124,58,237,0.12);
}

// ── Title bar ─────────────────────────────────────────────────────────────────
.dt__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: #0d0d1f;
  border-bottom: 1px solid $border-subtle;
  flex-shrink: 0;
}

.dt__dots { display: flex; gap: 0.45rem; }

.dt__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: filter 0.2s;

  &--red    { background: #ff5f57; }
  &--yellow { background: #ffbd2e; }
  &--green  { background: #28ca42; }

  &:hover { filter: brightness(1.25); }
}

.dt__bar-title {
  flex: 1;
  text-align: center;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  color: $text-secondary;
  margin-left: -4.5rem; // optical centering past the dots
}

.dt__bar-hint {
  font-family: 'Fira Code', monospace;
  font-size: 0.68rem;
  color: $text-muted;
  letter-spacing: 0.03em;
}

// ── Body ──────────────────────────────────────────────────────────────────────
.dt__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem 1rem;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.83rem;
  line-height: 1.65;
  cursor: text;
  background: #06060f;

  &::-webkit-scrollbar       { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: $border-violet;
    border-radius: 3px;
    &:hover { background: $accent-primary; }
  }
}

// ── Lines ─────────────────────────────────────────────────────────────────────
.dt__line {
  white-space: pre;

  &--cmd     { color: $accent-light;   font-weight: 600; }
  &--out     { color: #c8d6e5; }
  &--err     { color: #ff6b7a; }
  &--success { color: $accent-cyan; }
  &--accent  { color: $accent-primary; font-weight: 700; letter-spacing: 0.04em; }
  &--dim     { color: $text-muted; }
  &--blank   { min-height: 0.6rem; display: block; }
}

// ── Input row ─────────────────────────────────────────────────────────────────
.dt__input-row {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.dt__ps1 {
  color: $accent-primary;
  font-weight: 700;
  flex-shrink: 0;
}

.dt__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: $text-primary;
  font-family: inherit;
  font-size: inherit;
  caret-color: transparent; // we use the custom caret

  &::placeholder { color: $text-muted; }
  &:disabled { opacity: 0.5; }
}

.dt__caret {
  display: inline-block;
  width: 8px;
  height: 1.1em;
  background: $accent-primary;
  border-radius: 1px;
  margin-left: 1px;
  vertical-align: text-bottom;
  animation: dt-blink 1.1s step-end infinite;

  &--pause { animation: none; opacity: 0.4; }
}

// ── Animations ────────────────────────────────────────────────────────────────
@keyframes dt-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

// ── Transitions ───────────────────────────────────────────────────────────────
.dt-pop-enter-active,
.dt-pop-leave-active { transition: opacity 0.2s, transform 0.2s; }
.dt-pop-enter-from,
.dt-pop-leave-to     { opacity: 0; transform: translateY(8px); }

.dt-slide-enter-active,
.dt-slide-leave-active { transition: opacity 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.dt-slide-enter-from,
.dt-slide-leave-to     { opacity: 0; transform: scale(0.95) translateY(12px); }
</style>
