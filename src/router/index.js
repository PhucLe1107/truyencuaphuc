import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/status/:type',
      name: 'list',
      component: () => import('../views/ListView.vue'),
      props: true
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryListView.vue'),
    },
    {
      path: '/category/:slug',
      name: 'category-detail',
      component: () => import('../views/CategoryDetailView.vue'),
      props: true
    },
    {
      path: '/comic/:slug',
      name: 'comic-detail',
      component: () => import('../views/ComicDetailView.vue'),
      props: true
    },
    {
      path: '/comic/:slug/chapter/:chapterId',
      name: 'chapter-detail',
      component: () => import('../views/ChapterDetailView.vue'),
      props: true
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    // Legacy routes for backward compatibility
    {
      path: '/danh-sach/:type',
      redirect: to => ({
        name: 'list',
        params: { type: to.params.type },
        query: to.query
      })
    },
    {
      path: '/the-loai',
      redirect: { name: 'categories' }
    },
    {
      path: '/the-loai/:slug',
      redirect: to => ({
        name: 'category-detail',
        params: { slug: to.params.slug },
        query: to.query
      })
    },
    {
      path: '/truyen-tranh/:slug',
      redirect: to => ({
        name: 'comic-detail',
        params: { slug: to.params.slug },
        query: to.query
      })
    },
    {
      path: '/tim-kiem',
      redirect: { name: 'search' }
    },
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
