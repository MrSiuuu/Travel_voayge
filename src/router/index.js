import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: 'Accueil' } },
    { path: '/destinations', name: 'destinations', component: () => import('../views/DestinationsView.vue'), meta: { title: 'Destinations' } },
    { path: '/destinations/:id', name: 'destination', component: () => import('../views/DestinationDetailView.vue'), meta: { title: 'Destination' } },
    { path: '/connexion', name: 'login', component: () => import('../views/LoginView.vue'), meta: { title: 'Connexion' } },
    { path: '/inscription', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { title: 'Inscription' } },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — TimeTravel Agency` : 'TimeTravel Agency'
})

export default router
