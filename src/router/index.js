import { createRouter, createWebHistory } from 'vue-router'
import AuthForm from '@/components/AuthForm.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    component: AdminPanel,
    children: [
      {
        path: 'create-event',
        name: 'CreateEvent',
        component: () => import('@/components/admin/CreateEvent.vue')
      },
      {
        path: 'events',
        name: 'EventsList',
        component: () => import('@/components/admin/EventsList.vue')
      },
      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import('@/components/admin/PermissionsManager.vue')
      },
      {
        path: 'users',
        name: 'UsersList',
        component: () => import('@/components/admin/UsersList.vue')
      },

    ]
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthForm
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Временный байпас проверки авторизации
router.beforeEach((to, from, next) => {
  next()
})

export default router