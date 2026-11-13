<script setup lang="ts">
import type { Character } from '#shared/types/rick-and-morty'

defineProps<{
  characters: Character[]
  pending: boolean
}>()
</script>

<template>
  <div :aria-busy="pending" :class="pending && characters.length ? 'opacity-60 transition-opacity' : ''">
    <p v-if="pending" class="sr-only" aria-live="polite">
      Loading characters
    </p>
    <div v-if="pending && characters.length === 0" class="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="item in 8" :key="item" class="animate-pulse">
        <div class="aspect-square rounded-md bg-thumb/80" />
        <div class="mt-2 h-3 w-2/3 rounded bg-white/10" />
        <div class="mt-2 h-2 w-1/3 rounded bg-white/10" />
      </div>
    </div>
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <CharacterCard
        v-for="(character, index) in characters"
        :key="character.id"
        :character="character"
        :eager="index === 0"
      />
    </div>
  </div>
</template>
