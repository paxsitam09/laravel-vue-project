import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ItemList from '../views/Item/ItemList.vue'
import EditItem from '../views/Item/EditItem.vue'
import CreateItem from '@/views/Item/CreateItem.vue'
import { useAuthStore } from '@/stores/authStore'
import UserProfile from '@/components/UserProfile.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import axios from '@/axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/items',
      name: 'item-list',
      component: ItemList,
      meta: { requiresAuth: true }
    },
    {
      path: '/items/create',
      name: 'create-item',
      component: CreateItem,
      meta: { requiresAuth: true }
    },
    {
      path: '/items/:id/edit',
      name: 'edit-item',
      component: EditItem,
      meta: { requiresAuth: true }
    },
    {
      path: '/me',
      name: 'me',
      component: UserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/error/:code',
      name: 'Error',
      component: () => import('@/views/ErrorPage.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error/404'
    }
  ],
})

// Global error handler for axios
axios.interceptors.response.use(
  response => response,
  error => {
    const statusCode = error.response?.status
    if (statusCode) {
      router.push(`/error/${statusCode}`)
    }
    return Promise.reject(error)
  }
)

// Router error handler
router.onError((error) => {
  const notificationStore = useNotificationStore()
  console.error('Router Error:', error)
  router.push('/error/500')
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isLoggedIn) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
