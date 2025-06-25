import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      meta: { layout: 'empty' }, // Usará EmptyLayout
      component: () => import('@/components/LoginComp.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { layout: 'main' }, // Usará MainLayout
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      meta: { layout: 'main' }, // Usará MainLayout
      component: () => import('@/views/AboutView.vue'),
    },
    // Puedes agregar más rutas aquí
  ],
})

export default router
