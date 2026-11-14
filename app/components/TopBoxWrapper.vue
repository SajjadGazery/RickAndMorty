<script setup lang="ts">
defineProps<{
  blobClass?: string
}>()
</script>
<template>
  <section
      class="w-full bg-gradient-to-r py-6 from-transparent to-black relative md:py-6 md:pt-22 flex items-end">
    <div class="absolute inset-0 overflow-hidden">
      <div class="mx-auto w-full md:max-w-[var(--desktop-width)] relative px-4">
        <div
class="w-[200px] h-[150px] bg-portal rounded-full blur-[160px] top-0 left-[15%] transition-all absolute"
             :class="blobClass" />
      </div>
    </div>
    <div class="mx-auto w-full md:max-w-[var(--desktop-width)] relative px-4">
      <slot/>
    </div>
  </section>
</template>
