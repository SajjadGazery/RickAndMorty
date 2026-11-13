<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section>
    <header class="mb-4 flex items-center gap-3">
      <span class="text-portal">
        <slot name="icon" />
      </span>
      <h2 class="text-2xl font-medium tracking-wide text-white">
        {{ title }}
      </h2>
    </header>
    <slot />
  </section>
</template>
