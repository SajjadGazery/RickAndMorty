<script setup lang="ts">
import type { Character } from '#shared/types/rick-and-morty'
import { readNameQuery } from '#shared/utils/query'

const props = defineProps<{
  suggestions: Character[]
  pending: boolean
  failed: boolean
  query: string
}>()

const emit = defineEmits<{
  select: [character: Character]
}>()

function parts(name: string) {
  const query = readNameQuery(props.query)
  const index = name.toLowerCase().indexOf(query.toLowerCase())

  if (!query || index < 0)
    return [{ text: name, match: false }]

  return [
    { text: name.slice(0, index), match: false },
    { text: name.slice(index, index + query.length), match: true },
    { text: name.slice(index + query.length), match: false },
  ].filter(part => part.text)
}
</script>

<template>
  <div
    id="character-suggestions"
    class="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-lg bg-[#242528] shadow-2xl ring-1 ring-white/10"
    role="listbox"
    aria-label="Character suggestions"
  >
    <div v-if="pending && suggestions.length === 0" class="space-y-2 p-3" aria-hidden="true">
      <div v-for="item in 3" :key="item" class="flex animate-pulse items-center gap-3">
        <div class="size-10 rounded-md bg-white/10" />
        <div class="space-y-2">
          <div class="h-3 w-28 rounded bg-white/10" />
          <div class="h-2 w-14 rounded bg-white/10" />
        </div>
      </div>
    </div>

    <p v-else-if="failed" class="px-4 py-6 text-center text-sm text-mist" role="status">
      Could not load suggestions.
    </p>

    <p v-else-if="suggestions.length === 0" class="px-4 py-6 text-center text-sm text-mist" role="status">
      No characters found.
    </p>

    <ul v-else class="max-h-80 overflow-y-auto py-1" :class="pending ? 'opacity-60' : ''">
      <li v-for="character in suggestions" :key="character.id">
        <button
          class="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-white/5"
          type="button"
          role="option"
          @click="emit('select', character)"
        >
          <AppImage
            :src="character.image"
            alt=""
            width="40"
            height="40"
            class="size-10 shrink-0 rounded-md bg-thumb object-cover"
          />
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-white">
              <template v-for="(part, partIndex) in parts(character.name)" :key="partIndex">
                <mark v-if="part.match" class="bg-transparent text-portal">{{ part.text }}</mark>
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
            <CharacterStatus class="mt-0.5" :status="character.status" />
          </span>
        </button>
      </li>
    </ul>

    <button
      v-if="suggestions.length > 0"
      class="w-full border-t border-white/10 px-3 py-2.5 text-left text-xs font-semibold text-mist transition-colors hover:bg-white/5 hover:text-white"
      type="submit"
    >
      See all results
    </button>
  </div>
</template>
