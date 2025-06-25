import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JoinView from '../views/JoinView.vue'
import CallView from '../views/CallView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/join',
      name: 'join',
      component: JoinView,
    },
    {
      path: '/call',
      name: 'call',
      component: CallView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
