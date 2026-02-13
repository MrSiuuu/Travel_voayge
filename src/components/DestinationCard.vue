<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  epoch: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  image: { type: String, required: true },
  imageAlt: { type: String, default: '' },
})

const imageFailed = ref(false)
const imageStyle = computed(() => {
  if (imageFailed.value) return { background: 'linear-gradient(135deg, #1e1e2a 0%, #0a0a0f 100%)' }
  return {}
})
</script>

<template>
  <router-link
    :to="`/destinations/${id}`"
    class="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-brand-gold/50 dark:border-brand-border dark:bg-brand-card"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-brand-card">
      <img
        v-if="!imageFailed"
        :src="image"
        :alt="imageAlt"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        @error="imageFailed = true"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-brand-muted"
        :style="imageStyle"
      >
        <span class="font-serif text-lg">{{ name }}</span>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-60" />
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <p class="font-serif text-xl font-semibold text-white">{{ name }}</p>
        <p class="text-sm text-brand-gold">{{ epoch }}</p>
      </div>
    </div>
    <div class="p-4">
      <p v-if="tagline" class="mb-2 text-xs uppercase tracking-wider text-brand-gold">{{ tagline }}</p>
      <p class="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{{ description }}</p>
      <p class="mt-3 text-sm font-medium text-brand-gold group-hover:underline">Découvrir</p>
    </div>
  </router-link>
</template>
