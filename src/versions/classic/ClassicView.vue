<script setup lang="ts">
import ClassicHeader from './ClassicHeader.vue'
import ClassicHeroSection from './ClassicHeroSection.vue'
import ClassicProjectSection from './ClassicProjectSection.vue'
import ClassicServicesSection from './ClassicServicesSection.vue'
import ClassicPainsSection from './ClassicPainsSection.vue'
import ClassicProcessSection from './ClassicProcessSection.vue'
import ClassicContactSection from './ClassicContactSection.vue'
import ClassicFooter from './ClassicFooter.vue'
import DevTerminal from '@/components/base/DevTerminal.vue'
</script>

<template>
  <div class="classic">
    <ClassicHeader />
    <main>
      <ClassicHeroSection />
      <ClassicPainsSection />
      <ClassicServicesSection />
      <ClassicProjectSection />
      <ClassicProcessSection />
      <ClassicContactSection />
    </main>
    <ClassicFooter />
    <DevTerminal />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Bitcount:wght@100..900&family=Roboto:wght@300;400;500;600;700;900&display=swap');

// The original dark theme, scoped to this version so the other worlds stay untouched.
.classic {
  min-height: 100vh;
  background-color: $bg-deep;
  color: $text-primary;
  font-family: 'Roboto', sans-serif;
  font-size: 1.125rem;
  line-height: 1.6;

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Bitcount', sans-serif;
    font-weight: 700;
    line-height: 1.2;
  }

  a { color: $accent-light; }

  ::selection {
    background: rgba(124, 58, 237, 0.35);
    color: $text-primary;
  }
}

html:has(.classic) {
  background: $bg-deep;
  scrollbar-color: $accent-primary $bg-primary;
}
</style>
