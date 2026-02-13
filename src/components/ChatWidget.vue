<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const MAX_GUEST_MESSAGES = 3

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const open = ref(false)

const welcomeContent = computed(() => {
  const name = auth.profile?.full_name?.split(' ')[0] || null
  if (!auth.isLoggedIn) {
    return 'Bienvenue sur TimeTravel Agency. Découvrez nos trois destinations dans le temps (Crétacé, Florence 1504, Paris 1889) et posez-moi jusqu’à 3 questions ci-dessous. Créez un compte gratuit pour discuter sans limite et accéder à votre espace réservations.'
  }
  if (route.path === '/dashboard') {
    return name
      ? `Bonjour ${name}. Je peux vous aider pour vos réservations, nos destinations ou toute question. Que souhaitez-vous savoir ?`
      : 'Bonjour. Je peux vous aider pour vos réservations, nos destinations (Crétacé, Florence 1504, Paris 1889) ou toute question. Que souhaitez-vous savoir ?'
  }
  return name
    ? `Bonjour ${name}. Je peux vous aider à choisir une destination, répondre à vos questions ou vous guider vers votre espace. Que cherchez-vous ?`
    : 'Bonjour. Je peux vous aider à choisir entre le Crétacé, Florence 1504 et Paris 1889, ou répondre à vos questions. Créez un compte pour discuter sans limite.'
})

const messages = ref([])
onMounted(() => {
  if (messages.value.length === 0) messages.value = [{ role: 'assistant', content: welcomeContent.value }]
})
watch([() => auth.isLoggedIn, () => route.path], () => {
  if (messages.value.length > 0 && messages.value[0].role === 'assistant') {
    messages.value[0].content = welcomeContent.value
  }
}, { immediate: false })
const input = ref('')
const loading = ref(false)
const demoMode = ref(false)

const userMessageCount = computed(() => messages.value.filter((m) => m.role === 'user').length)
const limitReached = computed(() => !auth.isLoggedIn && userMessageCount.value >= MAX_GUEST_MESSAGES)
const canSend = computed(() => input.value.trim() && !loading.value && !limitReached.value)

async function send() {
  const text = input.value.trim()
  if (!text || loading.value || limitReached.value) return
  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value,
        userContext: auth.isLoggedIn
          ? auth.userContextForChat?.()
          : 'Utilisateur invité (non connecté), sans compte. Oriente-le vers la création d’un compte et vers le bouton « Nouvelle réservation » dans le dashboard pour réserver.',
      }),
    })
    const data = await res.json()
    if (data.error === 'demo') {
      demoMode.value = true
      messages.value.push({ role: 'assistant', content: data.message })
    } else if (data.content) {
      messages.value.push({ role: 'assistant', content: data.content })
    } else {
      messages.value.push({ role: 'assistant', content: 'Désolé, je n\'ai pas pu répondre. Réessayez ou consultez nos destinations.' })
    }
  } catch {
    messages.value.push({ role: 'assistant', content: 'Le service est indisponible. Consultez nos destinations ou faites le quiz pour une recommandation.' })
  } finally {
    loading.value = false
  }
}

function toggle() {
  open.value = !open.value
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end">
    <Transition name="chat">
      <div
        v-show="open"
        class="mb-3 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-brand-border dark:bg-brand-card"
      >
        <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-brand-border dark:bg-brand-dark/80">
          <p class="font-serif text-sm font-semibold text-gray-900 dark:text-white">Assistant TimeTravel</p>
          <p class="text-xs text-gray-500 dark:text-brand-muted">
            {{ auth.isLoggedIn && route.path === '/dashboard' ? 'Aide réservations et destinations' : 'Conseils et découverte' }}
          </p>
        </div>
        <div class="flex h-80 flex-col">
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              class="flex"
              :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[85%] rounded-lg px-4 py-2 text-sm"
                :class="msg.role === 'user'
                  ? 'bg-brand-gold text-brand-dark'
                  : 'border border-gray-200 bg-gray-100 text-gray-800 dark:border-brand-border dark:bg-brand-dark dark:text-gray-200'"
              >
                {{ msg.content }}
              </div>
            </div>
            <div v-if="loading" class="flex justify-start">
              <div class="rounded-lg border border-brand-border bg-brand-dark px-4 py-2 text-sm text-brand-muted">
                Réflexion…
              </div>
            </div>
            <div v-if="limitReached" class="rounded-lg border border-brand-gold/50 bg-brand-gold/10 p-4 text-sm text-gray-200">
              <p class="font-medium text-brand-gold">Limite atteinte (3 échanges)</p>
              <p class="mt-1">Créez un compte gratuit pour discuter sans limite avec l’assistant.</p>
              <button
                type="button"
                class="mt-3 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-goldDim"
                @click="router.push('/inscription'); toggle()"
              >
                Créer un compte
              </button>
            </div>
          </div>
          <form v-if="!limitReached" class="border-t border-brand-border p-3" @submit.prevent="send">
            <div v-if="!auth.isLoggedIn" class="mb-2 text-center text-xs text-brand-muted">
              {{ userMessageCount }} / {{ MAX_GUEST_MESSAGES }} échanges (visiteur)
            </div>
            <div class="flex gap-2">
              <input
                v-model="input"
                type="text"
                placeholder="Votre question..."
                maxlength="500"
                class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-brand-border dark:bg-brand-dark dark:text-white"
              />
              <button
                type="submit"
                class="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-goldDim disabled:opacity-50"
                :disabled="!canSend"
              >
                Envoyer
              </button>
            </div>
          </form>
          <div v-else class="border-t border-brand-border p-3">
            <p class="text-center text-xs text-gray-500">Connectez-vous pour continuer la conversation.</p>
          </div>
        </div>
      </div>
    </Transition>
    <button
      type="button"
      class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-card shadow-lg transition hover:border-brand-goldDim hover:bg-brand-dark dark:bg-brand-card dark:hover:bg-brand-dark"
      aria-label="Ouvrir le chat"
      @click="toggle"
    >
      <img src="/logo.png" alt="Chat" class="h-8 w-8 object-contain" />
    </button>
  </div>
</template>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
