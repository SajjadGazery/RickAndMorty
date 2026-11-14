<script setup lang="ts">
import { ref, watch } from '#imports'

const props = withDefaults(defineProps<{
  src?: string | null
  alt: string
  priority?: boolean
}>(), {
  src: null,
  priority: false,
})

const fallback = '/def.png'
const source = ref(props.src || fallback)

watch(() => props.src, (value) => {
  source.value = value || fallback
})

function onError() {
  if (source.value === fallback)
    return

  source.value = fallback
}
</script>

<template>
  <img
    :class="{ 'opacity-20 p-8': source === fallback }"
    :src="source"
    :alt="alt"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'low'"
    decoding="async"
    @error="onError"
  >
</template>
