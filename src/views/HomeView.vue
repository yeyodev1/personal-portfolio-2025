<script setup lang="ts">
import HeroSection from '@/components/homeSections/HeroSection.vue'
import WorkWall from '@/components/homeSections/WorkWall.vue'
import StackMarquee from '@/components/homeSections/StackMarquee.vue'
import ArchiveSection from '@/components/homeSections/ArchiveSection.vue'
import ManifestoSection from '@/components/homeSections/ManifestoSection.vue'
import ContactSection from '@/components/homeSections/ContactSection.vue'
import FloatingBadge from '@/components/ui/FloatingBadge.vue'
import { preloadFonts, preloadImages, usePagePreload } from '@/composables/usePreloader'
import { cdn } from '@/data/cdn'
import diegoPhoto from '@/assets/fotos/diego.jpg'

const preload = usePagePreload('muro')
preload.add(
  ...preloadFonts(['Bowlby One', 'Instrument Sans', 'DM Mono', 'Permanent Marker']),
  ...preloadImages([diegoPhoto, cdn('/work/courierbox.jpg', 720), cdn('/work/nicole-pastry-arts.jpg', 320)]),
)
</script>

<template>
  <HeroSection />
  <WorkWall />
  <StackMarquee />
  <ArchiveSection />
  <ManifestoSection />
  <ContactSection />
  <FloatingBadge />
</template>
