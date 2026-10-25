<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hidePreloader } from '@/composables/usePreloader'
import Footer from './components/global/Footer.vue'
import Header from './components/global/Header.vue'
import ToastNotification from './components/global/ToastNotification.vue'
import DevTerminal from './components/base/DevTerminal.vue'
import VersionSwitch from './components/global/VersionSwitch.vue'
import WhatsAppGate from './components/global/WhatsAppGate.vue'
import { useLanguage } from '@/composables/useLanguage'

const route = useRoute()
const router = useRouter()
const { init } = useLanguage()
onMounted(init)

// Light pages have nothing heavy to wait for, so the loading screen leaves at once.
router.afterEach((to) => {
  if (!to.meta.preload) nextTick(hidePreloader)
})
</script>

<template>
  <template v-if="route.meta.chrome === 'stickers'">
    <Header />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />
    <DevTerminal />
  </template>
  <RouterView v-else />
  <VersionSwitch v-if="route.name !== 'select' && !route.meta.legal" />
  <ToastNotification />
  <WhatsAppGate />
</template>

<style lang="scss">
.main-content {
  min-height: 100vh;
}
</style>
