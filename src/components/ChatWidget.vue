<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const MAX_GUEST_MESSAGES = 3

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)
const welcomeContent = computed(() => {
  const name = auth.profile?.full_name?.split(' ')[0] || null
  const base = 'Je suis l\'assistant de TimeTravel Agency. Je peux vous aider à choisir entre le Crétacé, Florence 1504 et Paris 1889, ou répondre à vos questions sur nos destinations et la sécurité des voyages temporels.'
  return name ? `Bonjour ${name}. ${base}` : `Bonjour. ${base}`
})
const messages = ref([])
onMounted(() => {
  if (messages.value.length === 0) messages.value = [{ role: 'assistant', content: welcomeContent.value }]
})
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
        userContext: auth.userContextForChat?.() || undefined,
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
        class="mb-3 w-full max-w-md overflow-hidden rounded-xl border border-brand-border bg-brand-card shadow-xl"
      >
        <div class="border-b border-brand-border bg-brand-dark/80 px-4 py-3">
          <p class="font-serif text-sm font-semibold text-white">Assistant TimeTravel</p>
          <p class="text-xs text-brand-muted">Conseils et recommandations</p>
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
                  : 'bg-brand-dark border border-brand-border text-gray-200'"
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
                class="flex-1 rounded-lg border border-brand-border bg-brand-dark px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
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
      class="flex h-14 w-14 items-center justify-center rounded-full border border-brand-border bg-brand-card text-white shadow-lg transition hover:border-brand-gold/50 hover:bg-brand-card"
      aria-label="Ouvrir le chat"
      @click="toggle"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
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
