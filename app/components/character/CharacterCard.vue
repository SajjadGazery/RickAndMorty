<script setup lang="ts">
import type { Character } from '#shared/types/rick-and-morty'

defineProps<{
  character: Character
  eager?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="`/characters/${character.id}`"
    :prefetch="false"
    class="group block rounded-md space-y-4 p-4 transition-all border border-transparent hover:border-white/5"
  >
    <AppImage
      :src="character.image"
      :alt="character.name"
      width="300"
      height="300"
      :priority="eager"
      class="aspect-square w-full rounded-md bg-thumb object-cover transition duration-300 group-hover:brightness-110"
    />
    <h2 class="truncate text-lg font-bold text-white" :title="character.name">
      {{ character.name }}
    </h2>
    <CharacterStatus :status="character.status" />
  </NuxtLink>
</template>
