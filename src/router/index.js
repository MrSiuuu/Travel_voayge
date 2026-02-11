import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: 'Accueil' } },
    { path: '/destinations', name: 'destinations', component: () => import('../views/DestinationsView.vue'), meta: { title: 'Destinations' } },
    { path: '/destinations/:id', name: 'destination', component: () => import('../views/DestinationDetailView.vue'), meta: { title: 'Destination' } },
    { path: '/connexion', name: 'login', component: () => import('../views/LoginView.vue'), meta: { title: 'Connexion' } },
    { path: '/inscription', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { title: 'Inscription' } },
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Mon espace', requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — TimeTravel Agency` : 'TimeTravel Agency'
})

export default router
