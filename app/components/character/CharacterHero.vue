<script setup lang="ts">
import type {Character} from '#shared/types/rick-and-morty'

defineProps<{
  character: Character
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center gap-4 sm:gap-6">
    <div class="relative isolate size-45 md:size-24 shrink-0 sm:size-60">
      <AppImage
          :src="character.image"
          :alt="character.name"
          width="300"
          height="300"
          priority
          class="size-full rounded-md bg-thumb object-cover"
      />
    </div>
    <div class="min-w-0 space-y-4">
      <h1 class="truncate text-2xl font-semibold text-white sm:text-[32px]" :title="character.name">
        {{ character.name }}
      </h1>
      <div class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs text-mist">
        <CharacterStatus :status="character.status"/>
      </div>
    </div>
  </div>
</template>
