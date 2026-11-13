<script setup lang="ts">
import type { LifeStatus } from '#shared/types/rick-and-morty'
import { formatLabel } from '~/utils/format'

const props = defineProps<{
  status: LifeStatus
}>()

const dotClass: Record<LifeStatus, string> = {
  Alive: 'bg-alive',
  Dead: 'bg-dead',
  unknown: 'bg-unknown',
}
</script>

<template>
  <span class="inline-flex items-baseline gap-2 text-[16px] text-white">
    <span class="size-3 shrink-0 rounded-full" :class="dotClass[props.status]" />
    {{ formatLabel(props.status) }}
  </span>
</template>
