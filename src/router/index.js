import { createRouter, createWebHistory } from 'vue-router'
console.log('Router is being created');
console.log('BaseUrl:', import.meta.env.BASE_URL);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dataQuery',
      component: () => import('../views/DataQueryView.vue'),
    },
    {
      path: '/intro',
      name: 'intro',
      component: () => import('../views/DemoIntroduce.vue'),
    },
  ],
})

export default router
