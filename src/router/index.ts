import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 'stickers' wraps the page in the sticker-wall header/footer; 'none' renders it bare.
    chrome?: 'stickers' | 'none'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'select',
      component: () => import('../views/SelectView.vue'),
      meta: { chrome: 'none' },
    },
    {
      path: '/clasica',
      name: 'clasica',
      component: () => import('../versions/classic/ClassicView.vue'),
      meta: { chrome: 'none' },
    },
    {
      path: '/muro',
      name: 'muro',
      component: () => import('../views/HomeView.vue'),
      meta: { chrome: 'stickers' },
    },
    {
      path: '/mundo',
      name: 'mundo',
      component: () => import('../versions/world/WorldView.vue'),
      meta: { chrome: 'none' },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
      meta: { chrome: 'stickers' },
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPostView.vue'),
      props: true,
      meta: { chrome: 'stickers' },
    },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
