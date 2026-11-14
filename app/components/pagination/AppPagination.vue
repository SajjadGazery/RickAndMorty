<script setup lang="ts">
import { computed } from '#imports'
import { buildPageItems } from '~/utils/pagination'

const props = defineProps<{
  page: number
  pages: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const items = computed(() => buildPageItems(props.page, props.pages))

function select(nextPage: number) {
  emit('update:page', nextPage)
}
</script>

<template>
  <nav class="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
    <button
      class="grid size-8 cursor-pointer place-items-center rounded-full text-mist transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portal disabled:pointer-events-none disabled:opacity-30"
      type="button"
      aria-label="Previous page"
      :disabled="page <= 1"
      @click="select(page - 1)"
    >
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.5 6.5 9 12l5.5 5.5" />
      </svg>
    </button>

    <template v-for="(item, index) in items" :key="`${item}-${index}`">
      <span v-if="item === 'gap'" class="px-1 text-xs text-mist" aria-hidden="true">…</span>
      <button
        v-else
        class="grid size-8 cursor-pointer place-items-center rounded-full text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portal"
        :class="item === page ? 'bg-portal text-ink' : 'text-mist hover:text-white'"
        type="button"
        :aria-current="item === page ? 'page' : undefined"
        :aria-label="`Page ${item}`"
        @click="select(item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      class="grid size-8 cursor-pointer place-items-center rounded-full text-mist transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portal disabled:pointer-events-none disabled:opacity-30"
      type="button"
      aria-label="Next page"
      :disabled="page >= pages"
      @click="select(page + 1)"
    >
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9.5 6.5 5.5 5.5-5.5 5.5" />
      </svg>
    </button>
  </nav>
</template>
