<script setup lang="ts">
import type { Place } from '#shared/types/rick-and-morty'
import { placeMeta } from '~/utils/format'

defineProps<{
  locations: Place[]
  pending?: boolean
}>()
</script>

<template>
  <DetailSection title="Locations">
    <template #icon>
      <SvgoLocation class="size-6" :font-controlled="false" aria-hidden="true" />
    </template>

    <div v-if="pending" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="item in 2" :key="item" class="h-[76px] animate-pulse rounded-lg bg-pool" />
    </div>
    <p v-else-if="locations.length === 0" class="text-sm text-mist">
      No locations listed.
    </p>
    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <DetailCard
        v-for="place in locations"
        :key="`${place.role}-${place.id ?? place.name}`"
        :title="place.name"
        :accent="place.role"
        :meta="placeMeta(place.type, place.dimension)"
      />
    </div>
  </DetailSection>
</template>
