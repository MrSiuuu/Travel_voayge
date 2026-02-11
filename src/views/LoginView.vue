<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe requis.'
    return
  }
  loading.value = true
  const { error: err } = await auth.signIn(email.value, password.value)
  loading.value = false
  if (err) {
    error.value = err.message || 'Connexion impossible.'
    return
  }
  router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-md px-4 py-20">
    <h1 class="font-serif text-3xl font-semibold text-white">Connexion</h1>
    <p class="mt-2 text-gray-400">Accédez à votre compte TimeTravel Agency.</p>

    <form class="mt-10 space-y-6" @submit.prevent="submit">
      <p v-if="error" class="rounded border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {{ error }}
      </p>
      <div>
        <label for="login-email" class="block text-sm font-medium text-gray-300">Email</label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="mt-2 w-full rounded-lg border border-brand-border bg-brand-card px-4 py-3 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
          placeholder="vous@exemple.fr"
        />
      </div>
      <div>
        <label for="login-password" class="block text-sm font-medium text-gray-300">Mot de passe</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="mt-2 w-full rounded-lg border border-brand-border bg-brand-card px-4 py-3 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-brand-gold py-3 font-medium text-brand-dark transition hover:bg-brand-goldDim disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? 'Connexion…' : 'Se connecter' }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-gray-400">
      Pas encore de compte ?
      <router-link to="/inscription" class="text-brand-gold hover:underline">S'inscrire</router-link>
    </p>
  </div>
</template>
