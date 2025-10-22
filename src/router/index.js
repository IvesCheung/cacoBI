import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dataQuery',
      component: () => import('../views/DataQueryView.vue'),
    },
  ],
})

export default router
