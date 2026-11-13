<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-canvas px-4 text-white">
    <div class="max-w-md text-center">
      <p class="font-logo text-6xl text-portal">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-3 text-xl font-semibold">
        {{ error.statusMessage || 'Something went wrong' }}
      </h1>
      <button
        class="mt-6 rounded-md bg-portal px-4 py-2 text-sm font-bold text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portal"
        type="button"
        @click="goHome"
      >
        Back to characters
      </button>
    </div>
  </div>
</template>
