import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 'stickers' wraps the page in the sticker-wall header/footer; 'none' renders it bare.
    chrome?: 'stickers' | 'none'
    // Pages that wait for their heavy assets behind the loading screen (see usePreloader).
    preload?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'select',
      component: () => import('../views/SelectView.vue'),
      meta: { chrome: 'none', preload: true },
    },
    {
      path: '/clasica',
      name: 'clasica',
      component: () => import('../versions/classic/ClassicView.vue'),
      meta: { chrome: 'none', preload: true },
    },
    {
      path: '/muro',
      name: 'muro',
      component: () => import('../views/HomeView.vue'),
      meta: { chrome: 'stickers', preload: true },
    },
    {
      path: '/mundo',
      name: 'mundo',
      component: () => import('../versions/world/WorldView.vue'),
      meta: { chrome: 'none', preload: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
