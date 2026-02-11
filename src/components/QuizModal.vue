<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { destinations, getDestinationById } from '../data/destinations'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open'])

const router = useRouter()
const step = ref(0)
const answers = ref({})
const resultId = ref(null)

const questions = [
  {
    id: 'era',
    label: 'Quel type d\'époque vous attire le plus ?',
    options: [
      { value: 'cretace', label: 'Préhistoire, nature sauvage, dinosaures' },
      { value: 'florence-1504', label: 'Renaissance, art et culture' },
      { value: 'paris-1889', label: 'Belle Époque, modernité et fête' },
    ],
  },
  {
    id: 'activity',
    label: 'Que souhaitez-vous vivre en priorité ?',
    options: [
      { value: 'adventure', label: 'Aventure et découverte d\'un monde disparu' },
      { value: 'culture', label: 'Rencontres culturelles et artistiques' },
      { value: 'social', label: 'Vie sociale et événements d\'époque' },
    ],
  },
  {
    id: 'duration',
    label: 'Durée idéale du séjour ?',
    options: [
      { value: 'short', label: 'Quelques jours (découverte)' },
      { value: 'medium', label: 'Une à deux semaines' },
      { value: 'long', label: 'Plus long (immersion)' },
    ],
  },
]

const currentQuestion = computed(() => questions[step.value])
const isLastStep = computed(() => step.value === questions.length - 1)
const result = computed(() => resultId.value ? getDestinationById(resultId.value) : null)

function selectAnswer(value) {
  answers.value[currentQuestion.value.id] = value
  if (isLastStep.value) {
    resultId.value = answers.value.era || 'paris-1889'
  } else {
    step.value++
  }
}

function close() {
  emit('update:open', false)
  setTimeout(() => {
    step.value = 0
    answers.value = {}
    resultId.value = null
  }, 300)
}

function goToDestination() {
  if (result.value) router.push(`/destinations/${result.value.id}`)
  close()
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
          class="relative w-full max-w-lg rounded-xl border border-brand-border bg-brand-card shadow-xl"
          @click.stop
        >
          <div class="flex items-center justify-between border-b border-brand-border p-4">
            <h2 class="font-serif text-xl font-semibold text-white">
              {{ result ? 'Votre recommandation' : 'Quiz destination' }}
            </h2>
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

          <div class="p-6">
            <template v-if="!result">
              <p class="mb-6 text-gray-300">{{ currentQuestion.label }}</p>
              <div class="space-y-3">
                <button
                  v-for="opt in currentQuestion.options"
                  :key="opt.value"
                  type="button"
                  class="w-full rounded-lg border border-brand-border bg-brand-dark/50 py-3 px-4 text-left text-sm font-medium text-white transition hover:border-brand-gold/50 hover:bg-brand-dark"
                  @click="selectAnswer(opt.value)"
                >
                  {{ opt.label }}
                </button>
              </div>
              <p class="mt-4 text-center text-xs text-brand-muted">Question {{ step + 1 }} / {{ questions.length }}</p>
            </template>

            <template v-else>
              <p class="mb-4 text-gray-400">D’après vos réponses, nous vous recommandons :</p>
              <div class="rounded-lg border border-brand-gold/30 bg-brand-dark/50 p-4">
                <p class="font-serif text-2xl font-semibold text-brand-gold">{{ result.name }}</p>
                <p class="mt-1 text-sm text-gray-400">{{ result.epoch }}</p>
                <p class="mt-2 text-sm text-gray-300">{{ result.tagline }}</p>
              </div>
              <div class="mt-6 flex gap-3">
                <button
                  type="button"
                  class="flex-1 rounded bg-brand-gold py-3 font-medium text-brand-dark transition hover:bg-brand-goldDim"
                  @click="goToDestination"
                >
                  Voir cette destination
                </button>
                <button
                  type="button"
                  class="rounded border border-brand-border py-3 px-4 font-medium text-gray-300 transition hover:border-brand-gold/50"
                  @click="close"
                >
                  Fermer
                </button>
              </div>
            </template>
          </div>
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
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.98);
}
</style>
