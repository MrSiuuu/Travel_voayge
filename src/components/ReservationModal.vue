<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import { destinations } from '../data/destinations'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open', 'created'])

const auth = useAuthStore()
const selectedDestinationId = ref('')
const dateSouhaitee = ref('')
const loading = ref(false)
const error = ref('')

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    selectedDestinationId.value = ''
    dateSouhaitee.value = ''
    error.value = ''
  }
})

async function submit() {
  if (!supabase || !auth.user) return
  const dest = destinations.find((d) => d.id === selectedDestinationId.value)
  if (!dest) {
    error.value = 'Veuillez choisir une destination.'
    return
  }
  error.value = ''
  loading.value = true
  const { error: err } = await supabase.from('reservations').insert({
    user_id: auth.user.id,
    destination_id: dest.id,
    destination_name: dest.name,
    destination_epoch: dest.epoch,
    status: 'confirmée',
    date_voyage_souhaitee: dateSouhaitee.value || null,
  })
  loading.value = false
  if (err) {
    error.value = err.message || 'Impossible d\'enregistrer la réservation.'
    return
  }
  emit('created')
  emit('update:open', false)
}

function close() {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm" />
        <div
          class="relative w-full max-w-md rounded-xl border border-brand-border bg-brand-card shadow-xl"
          @click.stop
        >
          <div class="flex items-center justify-between border-b border-brand-border px-4 py-3 sm:px-6">
            <h2 class="font-serif text-xl font-semibold text-white">Nouvelle réservation</h2>
            <button
              type="button"
              class="rounded p-2 text-gray-400 transition hover:bg-brand-border hover:text-white"
              aria-label="Fermer"
              @click="close"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form class="p-4 sm:p-6" @submit.prevent="submit">
            <p v-if="error" class="mb-4 rounded border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {{ error }}
            </p>
            <div class="mb-4">
              <label for="res-dest" class="block text-sm font-medium text-gray-300">Destination</label>
              <select
                id="res-dest"
                v-model="selectedDestinationId"
                required
                class="mt-2 w-full rounded-lg border border-brand-border bg-brand-dark px-4 py-3 text-white focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              >
                <option value="">Choisir une destination</option>
                <option v-for="d in destinations" :key="d.id" :value="d.id">
                  {{ d.name }} ({{ d.epoch }})
                </option>
              </select>
            </div>
            <div class="mb-6">
              <label for="res-date" class="block text-sm font-medium text-gray-300">Date souhaitée (optionnel)</label>
              <input
                id="res-date"
                v-model="dateSouhaitee"
                type="date"
                class="mt-2 w-full rounded-lg border border-brand-border bg-brand-dark px-4 py-3 text-white focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>
            <div class="flex gap-3">
              <button
                type="submit"
                class="flex-1 rounded-lg bg-brand-gold py-3 font-medium text-brand-dark transition hover:bg-brand-goldDim disabled:opacity-50"
                :disabled="loading || !selectedDestinationId"
              >
                {{ loading ? 'Enregistrement…' : 'Réserver' }}
              </button>
              <button
                type="button"
                class="rounded-lg border border-brand-border px-4 py-3 font-medium text-gray-300 transition hover:border-brand-gold/50"
                @click="close"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
