<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const navLinks = computed(() => [
  { path: '/', label: 'Accueil' },
  { path: '/destinations', label: 'Destinations' },
  ...(auth.isLoggedIn ? [{ path: '/dashboard', label: 'Mon espace' }] : [{ path: '/connexion', label: 'Connexion' }, { path: '/inscription', label: 'Inscription' }]),
])
</script>

<template>
  <footer class="border-t border-gray-200 bg-white dark:border-brand-border dark:bg-brand-card">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div class="grid gap-10 lg:grid-cols-3 lg:gap-8">
        <div class="lg:col-span-1">
          <router-link to="/" class="flex items-center gap-2">
            <img src="/logo.png" alt="TimeTravel Agency" class="h-10 w-10 object-contain" />
            <span class="font-serif text-xl font-semibold text-gray-900 dark:text-white">TimeTravel Agency</span>
          </router-link>
          <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Voyages dans le temps : Crétacé, Florence 1504, Paris 1889. Séjours encadrés et réservations sur mesure.
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-brand-gold">Navigation</h3>
          <ul class="mt-4 space-y-3">
            <li v-for="link in navLinks" :key="link.path">
              <router-link
                :to="link.path"
                class="text-sm text-gray-600 transition hover:text-brand-gold dark:text-gray-400 dark:hover:text-brand-gold"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-brand-gold">Contact</h3>
          <div class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p class="font-medium text-gray-900 dark:text-white">KOUYATE Issa</p>
            <p>Ingénieur DATA</p>
            <p>Chargé de projet IA chez Dyneff</p>
          </div>
        </div>
      </div>

      <div class="mt-12 border-t border-gray-200 pt-8 dark:border-brand-border">
        <p class="text-center text-xs text-gray-500 dark:text-brand-muted">
          &copy; {{ new Date().getFullYear() }} TimeTravel Agency. Projet pédagogique. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>
