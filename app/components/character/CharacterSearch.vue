<script setup lang="ts">
import type { Character, CharacterList } from '#shared/types/rick-and-morty'
import { readNameQuery } from '#shared/utils/query'

const route = useRoute()
const root = ref<HTMLElement | null>(null)
const draft = ref('')
const suggestions = ref<Character[]>([])
const open = ref(false)
const pending = ref(false)
const failed = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
let request = 0

watch(() => route.query.name, (value) => {
  draft.value = readNameQuery(value)
}, { immediate: true })

function close() {
  open.value = false
}

function queue(raw: string) {
  clearTimeout(timer)

  const name = readNameQuery(raw)

  if (!name) {
    request += 1
    suggestions.value = []
    pending.value = false
    failed.value = false
    close()
    return
  }

  open.value = true
  pending.value = true
  timer = setTimeout(() => load(name), 300)
}

async function load(name: string) {
  const current = ++request

  try {
    const result = await $fetch<CharacterList>('/api/characters', {
      query: { name, page: 1 },
    })

    if (current !== request)
      return

    suggestions.value = result.results.slice(0, 8)
    failed.value = false
  }
  catch {
    if (current !== request)
      return

    suggestions.value = []
    failed.value = true
  }
  finally {
    if (current === request)
      pending.value = false
  }
}

function onInput(event: Event) {
  const value = event.target instanceof HTMLInputElement ? event.target.value : draft.value
  queue(value)
}

function onFocus() {
  if (readNameQuery(draft.value))
    queue(draft.value)
}

function submit() {
  close()
  navigateTo({
    path: '/',
    query: {
      name: readNameQuery(draft.value) || undefined,
    },
  })
}

function select(character: Character) {
  close()
  navigateTo(`/characters/${character.id}`)
}

function onPointerDown(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node))
    close()
}

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => {
  clearTimeout(timer)
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div ref="root" class="group relative z-30 bg-[#2C2E30] w-full border border-white/5 p-4 h-[80px] rounded-xl">
    <form class="h-full" @submit.prevent="submit">
      <div class="flex items-center gap-3 h-full">
        <div class="relative flex h-full flex-auto items-center gap-2 rounded-lg bg-[#3B3D3F] p-2 transition-[box-shadow,background-color] duration-200 focus-within:bg-[#424242] w-[calc(100%-116px)]">
          <label class="sr-only" for="character-search">Search for characters</label>
          <input
              id="character-search"
              v-model="draft"
              name="name"
              type="search"
              enterkeyhint="search"
              autocomplete="off"
              spellcheck="false"
              placeholder="Search for characters..."
              role="combobox"
              aria-autocomplete="list"
              aria-controls="character-suggestions"
              :aria-expanded="open"
              class="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/45"
              @input="onInput"
              @focus="onFocus"
              @keydown.escape="close"
          >
        </div>
        <button
            class="w-[46px] md:w-auto inline-flex h-full shrink-0 cursor-pointer items-center gap-2 rounded-md bg-portal px-4 text-sm font-semibold text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            type="submit"
            :aria-busy="pending"
        >
          <span
              v-if="pending"
              class="size-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink"
          />
          <SvgoSearch v-else class="size-4" :font-controlled="false" aria-hidden="true" />
          <span class="hidden md:block">Search</span>
        </button>
      </div>

      <CharacterSuggestions
        v-if="open"
        :suggestions="suggestions"
        :pending="pending"
        :failed="failed"
        :query="draft"
        @select="select"
      />
    </form>
  </div>
</template>
