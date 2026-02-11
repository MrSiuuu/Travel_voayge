<script setup>
import { ref, onMounted } from 'vue'
import { destinations } from '../data/destinations'
import DestinationCard from '../components/DestinationCard.vue'
import QuizModal from '../components/QuizModal.vue'

const heroImageFailed = ref(false)
const showQuiz = ref(false)

onMounted(() => {
  const hero = new Image()
  hero.onerror = () => { heroImageFailed.value = true }
  hero.src = destinations[0]?.image || '/destinations/cretace.png'
})
</script>

<template>
  <div>
    <section class="relative min-h-[85vh] overflow-hidden">
      <div
        v-if="heroImageFailed"
        class="absolute inset-0 bg-gradient(145deg, #12121a 0%, #0a0a0f 50%, #1e1e2a 100%)"
      />
      <img
        v-else
        :src="destinations[0]?.image || '/destinations/cretace.png'"
        alt="Voyage dans le temps"
        class="absolute inset-0 h-full w-full object-cover"
        @error="heroImageFailed = true"
      />
      <div class="absolute inset-0 bg-brand-dark/70" />
      <div class="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">
        <p class="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
          Agence de voyage dans le temps
        </p>
        <h1 class="max-w-2xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
          Choisissez votre époque. Nous nous occupons du reste.
        </h1>
        <p class="mt-6 max-w-xl text-lg text-gray-300">
          Trois destinations exceptionnelles, des protocoles de sécurité éprouvés et un accompagnement sur mesure pour vivre l’histoire sans la réécrire.
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <router-link
            to="/destinations"
            class="inline-flex items-center rounded bg-brand-gold px-6 py-3 font-medium text-brand-dark transition hover:bg-brand-goldDim"
          >
            Voir les destinations
          </router-link>
          <button
            type="button"
            class="inline-flex items-center rounded border border-brand-border bg-brand-card/80 px-6 py-3 font-medium text-white transition hover:border-brand-gold/50 hover:bg-brand-card"
            @click="showQuiz = true"
          >
            Quiz : quelle destination pour moi ?
          </button>
        </div>
      </div>
    </section>

    <section class="border-t border-brand-border bg-brand-card/30 py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 class="font-serif text-3xl font-semibold text-white sm:text-4xl">
          Pourquoi TimeTravel Agency
        </h2>
        <p class="mt-4 max-w-2xl text-gray-400">
          Nous proposons des séjours temporels encadrés, avec des protocoles stricts de non-interférence et un suivi continu. Chaque voyage est conçu pour l’authenticité et la sécurité.
        </p>
        <div class="mt-12 grid gap-8 sm:grid-cols-3">
          <div class="border-l-2 border-brand-gold pl-6">
            <h3 class="font-serif text-lg font-semibold text-white">Destinations vérifiées</h3>
            <p class="mt-2 text-sm text-gray-400">Crétacé, Florence 1504, Paris 1889 : trois époques accessibles avec un taux de réussite maximal.</p>
          </div>
          <div class="border-l-2 border-brand-gold pl-6">
            <h3 class="font-serif text-lg font-semibold text-white">Sécurité avant tout</h3>
            <p class="mt-2 text-sm text-gray-400">Bulles de protection, consignes claires et retour garanti. Aucune prise de risque sur la chronologie.</p>
          </div>
          <div class="border-l-2 border-brand-gold pl-6">
            <h3 class="font-serif text-lg font-semibold text-white">Conseil personnalisé</h3>
            <p class="mt-2 text-sm text-gray-400">Agent de voyage temporel et quiz pour vous orienter vers la destination qui vous correspond.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 class="font-serif text-3xl font-semibold text-white sm:text-4xl">
          Nos destinations
        </h2>
        <p class="mt-4 text-gray-400">
          Trois époques, trois expériences. Cliquez pour les détails et les conditions.
        </p>
        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <DestinationCard
            v-for="d in destinations"
            :key="d.id"
            :id="d.id"
            :name="d.name"
            :epoch="d.epoch"
            :tagline="d.tagline"
            :description="d.description"
            :image="d.image"
            :image-alt="d.imageAlt"
          />
        </div>
        <div class="mt-12 text-center">
          <router-link
            to="/destinations"
            class="inline-flex items-center text-brand-gold transition hover:underline"
          >
            Voir toutes les destinations
          </router-link>
        </div>
      </div>
    </section>

    <QuizModal v-model:open="showQuiz" />
  </div>
</template>
