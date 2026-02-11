<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const menuOpen = ref(false)

const navLinks = [
  { path: '/', label: 'Accueil' },
  { path: '/destinations', label: 'Destinations' },
]

function goTo(path) {
  router.push(path)
  menuOpen.value = false
}

function logout() {
  auth.signOut()
  menuOpen.value = false
  goTo('/')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-brand-border bg-brand-dark/95 backdrop-blur supports-[backdrop-filter]:bg-brand-dark/80">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <router-link to="/" class="font-serif text-xl font-semibold tracking-tight text-white sm:text-2xl">
        TimeTravel Agency
      </router-link>

      <nav class="hidden items-center gap-8 md:flex">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-sm font-medium text-gray-300 transition hover:text-brand-gold"
          active-class="text-brand-gold"
        >
          {{ link.label }}
        </router-link>
        <template v-if="auth.isLoggedIn">
          <span class="text-sm text-brand-muted">{{ auth.profile?.full_name || auth.user?.email }}</span>
          <button type="button" class="text-sm font-medium text-gray-300 transition hover:text-brand-gold" @click="logout">
            Déconnexion
          </button>
        </template>
        <template v-else>
          <button type="button" class="text-sm font-medium text-gray-300 transition hover:text-brand-gold" @click="goTo('/connexion')">
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

      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded border border-brand-border text-gray-400 md:hidden"
        aria-label="Menu"
        @click="menuOpen = !menuOpen"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div
      v-show="menuOpen"
      class="border-t border-brand-border bg-brand-card px-4 py-4 md:hidden"
    >
      <div class="flex flex-col gap-2">
        <button
          v-for="link in navLinks"
          :key="link.path"
          type="button"
          class="text-left text-sm font-medium text-gray-300"
          @click="goTo(link.path)"
        >
          {{ link.label }}
        </button>
        <template v-if="auth.isLoggedIn">
          <span class="border-t border-brand-border pt-2 text-sm text-brand-muted">{{ auth.user?.email }}</span>
          <button type="button" class="text-left text-sm text-gray-300" @click="logout">Déconnexion</button>
        </template>
        <template v-else>
          <button type="button" class="text-left text-sm text-gray-300" @click="goTo('/connexion')">Connexion</button>
          <button type="button" class="text-left text-sm font-medium text-brand-gold" @click="goTo('/inscription')">Inscription</button>
        </template>
      </div>
    </div>
  </header>
</template>
