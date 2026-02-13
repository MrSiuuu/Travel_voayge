<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const fullName = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  success.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe requis.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Le mot de passe doit faire au moins 6 caractères.'
    return
  }
  loading.value = true
  const { data, error: err } = await auth.signUp(email.value, password.value, {
    full_name: fullName.value || undefined,
  })
  loading.value = false
  if (err) {
    error.value = err.message || 'Inscription impossible.'
    return
  }
  // Confirmation email désactivée sur Supabase : l'utilisateur est connecté directement
  success.value = 'Compte créé. Redirection vers votre espace…'
  if (data?.user) router.push('/dashboard')
}
</script>

<template>
  <div class="mx-auto max-w-md px-4 py-20">
    <h1 class="font-serif text-3xl font-semibold text-gray-900 dark:text-white">Inscription</h1>
    <p class="mt-2 text-gray-600 dark:text-gray-400">Créez votre compte pour personnaliser vos recommandations.</p>

    <form class="mt-10 space-y-6" @submit.prevent="submit">
      <p v-if="error" class="rounded border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
        {{ error }}
      </p>
      <p v-if="success" class="rounded border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
        {{ success }}
      </p>
      <div>
        <label for="reg-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom (optionnel)</label>
        <input
          id="reg-name"
          v-model="fullName"
          type="text"
          autocomplete="name"
          class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-brand-border dark:bg-brand-card dark:text-white"
          placeholder="Votre nom"
        />
      </div>
      <div>
        <label for="reg-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          id="reg-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-brand-border dark:bg-brand-card dark:text-white"
          placeholder="vous@exemple.fr"
        />
      </div>
      <div>
        <label for="reg-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
        <input
          id="reg-password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
          minlength="6"
          class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-brand-border dark:bg-brand-card dark:text-white"
        />
        <p class="mt-1 text-xs text-gray-500">Minimum 6 caractères.</p>
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-brand-gold py-3 font-medium text-brand-dark transition hover:bg-brand-goldDim disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? 'Création…' : 'Créer mon compte' }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
      Déjà un compte ?
      <router-link to="/connexion" class="text-brand-gold hover:underline">Se connecter</router-link>
    </p>
  </div>
</template>
