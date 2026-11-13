<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="rounded-lg bg-white/5 px-6 py-12 text-center">
    <h2 class="text-lg font-semibold text-white">
      {{ title }}
    </h2>
    <p class="mx-auto mt-2 max-w-md text-sm text-mist">
      {{ description }}
    </p>
  </div>
</template>
