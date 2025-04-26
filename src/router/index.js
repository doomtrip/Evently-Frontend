import { createRouter, createWebHistory } from 'vue-router'
import GuestPanel from '@/components/guest/GuestPanel.vue'
import AuthView from '@/views/AuthView.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import UserPanel from '@/components/user/UserPanel.vue'

const routes = [

  {
    path: '/',
    name: 'Home',
    component: GuestPanel
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView
  },
  {
    path: '/event/:id',
    name: 'Event',
    component: () => import('@/components/EventPage.vue'),
    props: true
  },

{
  path: '/user',
  component: UserPanel,
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      redirect: 'events'
    },
    {
      path: 'profile',
      name: 'ProfileSettings',
      component: () => import('@/components/ProfileSettings.vue')
    }
  ]
},
{
  path: '/admin',
  component: AdminPanel,
  meta: { requiresAuth: true, requiresAdmin: true },
  children: [
    {
      path: '',
      redirect: { name: 'EventsList' }
    },
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
    }
  ]
},
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem('authToken')
  let user = null
  
  try {
    if(authToken) user = JSON.parse(atob(authToken))
  } catch(e) {
    localStorage.removeItem('authToken')
  }

  if (to.meta.requiresAuth && !user) {
    next('/auth')
  } else if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next('/')
  } else {
    next()
  }
})

export default router