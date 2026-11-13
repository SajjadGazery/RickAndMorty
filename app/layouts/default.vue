<script setup lang="ts">
const route = useRoute()
const isDetail = computed(() => route.path.startsWith('/characters/'))
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-canvas text-white pb-[8rem]">
    <!--    px-4 py-5 sm:px-6 sm:py-7 lg:px-8-->
    <div class="relative mx-auto flex w-full flex-col">
      <header class="absolute inset-x-0 top-0">
        <div class="w-full md:max-w-[var(--desktop-width)] mx-auto px-4">
          <AppLogo class="mb-5" :class="isDetail ? 'self-start' : 'self-start sm:self-center'"/>
        </div>
      </header>
      <main id="content">
        <slot/>
      </main>
    </div>
  </div>
</template>
