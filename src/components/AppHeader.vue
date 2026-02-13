<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()
const menuOpen = ref(false)

const navLinks = computed(() => [
  { path: '/', label: 'Accueil' },
  { path: '/destinations', label: 'Destinations' },
  ...(auth.isLoggedIn ? [{ path: '/dashboard', label: 'Mon espace' }] : []),
])

function goTo(path) {
  router.push(path)
  menuOpen.value = false
}

async function logout() {
  menuOpen.value = false
  await auth.signOut()
  goTo('/')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-brand-border dark:bg-brand-dark/95">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <router-link to="/" class="flex items-center gap-3">
        <img src="/logo.png" alt="TimeTravel Agency" class="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10" />
        <span class="font-serif text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          TimeTravel Agency
        </span>
      </router-link>

      <nav class="hidden items-center gap-6 md:flex">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-sm font-medium text-gray-600 transition hover:text-brand-gold dark:text-gray-300 dark:hover:text-brand-gold"
          active-class="!text-brand-gold"
        >
          {{ link.label }}
        </router-link>
        <button
          type="button"
          class="rounded p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-brand-border dark:hover:text-white"
          :aria-label="theme.isDark ? 'Mode clair' : 'Mode sombre'"
          @click="theme.toggle()"
        >
          <svg v-if="theme.isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        <template v-if="auth.isLoggedIn">
          <span class="text-sm text-gray-500 dark:text-brand-muted">{{ auth.profile?.full_name || auth.user?.email }}</span>
          <button type="button" class="text-sm font-medium text-gray-600 transition hover:text-brand-gold dark:text-gray-300 dark:hover:text-brand-gold" @click="logout">
            Déconnexion
          </button>
        </template>
        <template v-else>
          <button type="button" class="text-sm font-medium text-gray-600 transition hover:text-brand-gold dark:text-gray-300 dark:hover:text-brand-gold" @click="goTo('/connexion')">
            Connexion
          </button>
          <button
            type="button"
            class="rounded bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-goldDim"
            @click="goTo('/inscription')"
          >
            Inscription
          </button>
        </template>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded p-2 text-gray-500 dark:text-gray-400 md:hidden"
          :aria-label="theme.isDark ? 'Mode clair' : 'Mode sombre'"
          @click="theme.toggle()"
        >
          <svg v-if="theme.isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-gray-600 dark:border-brand-border dark:text-gray-400 md:hidden"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-show="menuOpen"
      class="border-t border-gray-200 bg-white px-4 py-4 dark:border-brand-border dark:bg-brand-card md:hidden"
    >
      <div class="flex flex-col gap-2">
        <button
          v-for="link in navLinks"
          :key="link.path"
          type="button"
          class="text-left text-sm font-medium text-gray-700 dark:text-gray-300"
          @click="goTo(link.path)"
        >
          {{ link.label }}
        </button>
        <template v-if="auth.isLoggedIn">
          <button type="button" class="text-left text-sm font-medium text-brand-gold" @click="goTo('/dashboard')">Mon espace</button>
          <span class="border-t border-gray-200 pt-2 text-sm text-gray-500 dark:border-brand-border dark:text-brand-muted">{{ auth.user?.email }}</span>
          <button type="button" class="text-left text-sm text-gray-600 dark:text-gray-300" @click="logout">Déconnexion</button>
        </template>
        <template v-else>
          <button type="button" class="text-left text-sm text-gray-600 dark:text-gray-300" @click="goTo('/connexion')">Connexion</button>
          <button type="button" class="text-left text-sm font-medium text-brand-gold" @click="goTo('/inscription')">Inscription</button>
        </template>
      </div>
    </div>
  </header>
</template>
