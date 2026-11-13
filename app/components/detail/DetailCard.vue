<script setup lang="ts">
defineProps<{
  title: string
  accent: string
  meta: string
}>()
</script>

<template>
  <article class="min-w-0 rounded-2xl bg-pool p-4 space-y-4 transition-colors hover:bg-pool-soft">
    <h3 class="truncate text-xl font-bold text-white" :title="title">
      {{ title }}
    </h3>
    <p class="truncate text-sm font-medium text-lagoon" :title="accent">
      {{ accent }}
    </p>
    <p class="truncate text-sm font-normal text-mist" :title="meta">
      {{ meta }}
    </p>
  </article>
</template>
