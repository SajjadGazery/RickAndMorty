<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="rounded-lg bg-white/5 px-6 py-12 text-center" role="alert">
    <h2 class="text-lg font-semibold text-white">
      {{ title }}
    </h2>
    <p class="mx-auto mt-2 max-w-md text-sm text-mist">
      {{ message }}
    </p>
    <button
      class="mt-5 rounded-md bg-portal px-4 py-2 text-sm font-bold text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portal"
      type="button"
      @click="emit('retry')"
    >
      Try again
    </button>
  </div>
</template>
