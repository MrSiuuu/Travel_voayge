<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDestinationById } from '../data/destinations'

const route = useRoute()
const destination = computed(() => getDestinationById(route.params.id))
const imageFailed = ref(false)

onMounted(() => {
  if (!destination.value) return
  const img = new Image()
  img.onerror = () => { imageFailed.value = true }
  img.src = destination.value.image
})
</script>

<template>
  <div v-if="!destination" class="mx-auto max-w-6xl px-4 py-24 text-center">
    <h1 class="font-serif text-2xl text-gray-900 dark:text-white">Destination introuvable</h1>
    <router-link to="/destinations" class="mt-4 inline-block text-brand-gold hover:underline">Retour aux destinations</router-link>
  </div>

  <article v-else class="pb-24">
    <section class="relative h-[50vh] min-h-[320px] overflow-hidden">
      <div
        v-if="imageFailed"
        class="absolute inset-0 flex items-center justify-center bg-gradient(135deg, #12121a 0%, #0a0a0f 100%)"
      >
        <span class="font-serif text-2xl text-brand-muted">{{ destination.name }}</span>
      </div>
      <img
        v-else
        :src="destination.image"
        :alt="destination.imageAlt"
        class="h-full w-full object-cover"
        @error="imageFailed = true"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div class="mx-auto max-w-6xl">
          <p class="text-sm font-medium uppercase tracking-wider text-brand-gold">{{ destination.epoch }}</p>
          <h1 class="mt-2 font-serif text-4xl font-semibold text-white sm:text-5xl">{{ destination.name }}</h1>
          <p v-if="destination.tagline" class="mt-2 text-lg text-gray-300">{{ destination.tagline }}</p>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{{ destination.longDescription }}</p>

      <section class="mt-14">
        <h2 class="font-serif text-2xl font-semibold text-gray-900 dark:text-white">À vivre sur place</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="(item, i) in destination.highlights"
            :key="i"
            class="flex items-start gap-3 border-l-2 border-brand-gold/50 pl-4 text-gray-700 dark:text-gray-300"
          >
            <span class="text-brand-gold">—</span>
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="mt-14 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-brand-border dark:bg-brand-card/50">
        <h2 class="font-serif text-2xl font-semibold text-gray-900 dark:text-white">Consignes de sécurité</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">À respecter impérativement pour tout séjour temporel.</p>
        <ul class="mt-4 space-y-2">
          <li
            v-for="(item, i) in destination.safety"
            :key="i"
            class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
            {{ item }}
          </li>
        </ul>
      </section>

      <div class="mt-14 flex flex-wrap gap-4">
        <router-link
          to="/destinations"
          class="inline-flex items-center text-brand-gold transition hover:underline"
        >
          Retour aux destinations
        </router-link>
        <router-link
          to="/"
          class="inline-flex items-center text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Accueil
        </router-link>
      </div>
    </div>
  </article>
</template>
