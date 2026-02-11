<script setup>
import { destinations } from '../data/destinations'
import DestinationCard from '../components/DestinationCard.vue'
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <header class="mb-16">
      <p class="text-sm font-medium uppercase tracking-wider text-brand-gold">Destinations</p>
      <h1 class="mt-2 font-serif text-4xl font-semibold text-white sm:text-5xl">
        Choisissez votre époque
      </h1>
      <p class="mt-6 max-w-2xl text-gray-400">
        Trois voyages temporels accessibles avec encadrement et protocoles de sécurité. Chaque destination propose un programme détaillé et des conditions claires.
      </p>
    </header>

    <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
  </div>
</template>
