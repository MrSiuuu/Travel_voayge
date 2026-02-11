<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import ReservationModal from '../components/ReservationModal.vue'

const auth = useAuthStore()
const reservations = ref([])
const loading = ref(true)
const showReservationModal = ref(false)

const displayName = computed(() => auth.profile?.full_name || auth.user?.email || 'Utilisateur')

async function fetchReservations() {
  if (!supabase || !auth.user) return
  loading.value = true
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })
  if (!error) reservations.value = data || []
  loading.value = false
}

function onReservationCreated() {
  showReservationModal.value = false
  fetchReservations()
}

onMounted(() => fetchReservations())
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <header class="mb-10">
      <p class="text-sm font-medium uppercase tracking-wider text-brand-gold">Mon espace</p>
      <h1 class="mt-2 font-serif text-3xl font-semibold text-white sm:text-4xl">
        Bonjour{{ displayName && displayName !== 'Utilisateur' ? `, ${displayName}` : '' }}
      </h1>
      <p class="mt-2 text-gray-400">
        Gérez vos réservations et accédez à vos reçus.
      </p>
    </header>

    <section class="mb-10">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="font-serif text-xl font-semibold text-white">Mes réservations</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-brand-goldDim"
          @click="showReservationModal = true"
        >
          Nouvelle réservation
        </button>
      </div>

      <div v-if="loading" class="mt-6 text-center text-brand-muted">Chargement…</div>
      <div v-if="!loading && reservations.length === 0" class="mt-8 rounded-xl border border-brand-border bg-brand-card/50 p-8 text-center">
        <p class="text-gray-400">Aucune réservation pour le moment.</p>
        <button
          type="button"
          class="mt-4 text-brand-gold hover:underline"
          @click="showReservationModal = true"
        >
          Réserver un voyage
        </button>
      </div>
      <div v-else class="mt-6 grid gap-6 sm:grid-cols-1">
        <article
          v-for="r in reservations"
          :key="r.id"
          class="reservation-receipt rounded-xl border border-brand-border bg-brand-card overflow-hidden print:shadow-none"
        >
          <div class="border-b border-brand-border bg-brand-dark/50 px-4 py-3 sm:px-6">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-xs font-medium uppercase tracking-wider text-brand-gold">Reçu de réservation</p>
              <p class="text-xs text-brand-muted">Ref. {{ String(r.id).slice(0, 8) }}</p>
            </div>
          </div>
          <div class="p-4 sm:p-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs text-brand-muted">Destination</p>
                <p class="font-serif text-lg font-semibold text-white">{{ r.destination_name }}</p>
                <p v-if="r.destination_epoch" class="text-sm text-gray-400">{{ r.destination_epoch }}</p>
              </div>
              <div>
                <p class="text-xs text-brand-muted">Date souhaitée</p>
                <p class="text-white">{{ r.date_voyage_souhaitee ? new Date(r.date_voyage_souhaitee).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non précisée' }}</p>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-border pt-4">
              <span
                class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                :class="r.status === 'confirmée' ? 'bg-green-500/20 text-green-300' : r.status === 'annulée' ? 'bg-red-500/20 text-red-300' : 'bg-brand-gold/20 text-brand-gold'"
              >
                {{ r.status }}
              </span>
              <span class="text-xs text-brand-muted">{{ new Date(r.created_at).toLocaleDateString('fr-FR') }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="rounded-xl border border-brand-border bg-brand-card/50 p-6">
      <h2 class="font-serif text-lg font-semibold text-white">Aide</h2>
      <p class="mt-2 text-sm text-gray-400">
        Utilisez le chat en bas à droite pour poser vos questions. L’assistant connaît votre profil et peut vous conseiller sur les destinations.
      </p>
      <router-link to="/destinations" class="mt-4 inline-block text-sm text-brand-gold hover:underline">Voir les destinations</router-link>
    </section>

    <ReservationModal v-model:open="showReservationModal" @created="onReservationCreated" />
  </div>
</template>
