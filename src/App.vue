<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Footer from './components/global/Footer.vue'
import Header from './components/global/Header.vue'
import ToastNotification from './components/global/ToastNotification.vue'
import DevTerminal from './components/base/DevTerminal.vue'
import VersionSwitch from './components/global/VersionSwitch.vue'
import { useLanguage } from '@/composables/useLanguage'

const route = useRoute()
const { init } = useLanguage()
onMounted(init)
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
  <VersionSwitch v-if="route.name !== 'select'" />
  <ToastNotification />
</template>

<style lang="scss">
.main-content {
  min-height: 100vh;
}
</style>
