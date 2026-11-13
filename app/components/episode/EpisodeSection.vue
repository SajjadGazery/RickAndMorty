<script setup lang="ts">
import type { Episode } from '#shared/types/rick-and-morty'
import { formatLabel } from '~/utils/format'

defineProps<{
  episodes: Episode[]
  pending?: boolean
}>()
</script>

<template>
  <DetailSection title="Episodes">
    <template #icon>
      <SvgoList class="size-6" :font-controlled="false" aria-hidden="true" />
    </template>

    <div v-if="pending" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="item in 8" :key="item" class="h-[76px] animate-pulse rounded-lg bg-pool" />
    </div>
    <p v-else-if="episodes.length === 0" class="text-sm text-mist">
      No episodes listed.
    </p>
    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <DetailCard
        v-for="episode in episodes"
        :key="episode.id"
        :title="episode.name"
        :accent="episode.code"
        :meta="formatLabel(episode.airDate)"
      />
    </div>
  </DetailSection>
</template>
