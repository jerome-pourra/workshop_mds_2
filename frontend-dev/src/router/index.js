import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JoinView from '../views/JoinView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/join',
      name: 'join',
      component: JoinView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/join',
    //   name: 'join',
    //   // component: JoinView,
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/JoinView.vue'),
    // },
  ],
})

export default router
