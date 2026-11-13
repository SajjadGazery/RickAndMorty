<script setup lang="ts">
import type { CharacterDetail } from '#shared/types/rick-and-morty'
import { readIdParam } from '#shared/utils/query'
import { formatLabel } from '~/utils/format'

const route = useRoute()
const router = useRouter()
const id = computed(() => readIdParam(route.params.id))

if (id.value === null) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Character not found',
  })
}

const { data, error, status, refresh } = await useAsyncData(
  computed(() => `character:${id.value}`),
  () => $fetch<CharacterDetail>(`/api/characters/${id.value}`),
  { watch: [id] },
)

function notFound(value: unknown) {
  return !!value && typeof value === 'object' && 'statusCode' in value && Number(value.statusCode) === 404
}

if (notFound(error.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Character not found',
  })
}

watch(error, (value) => {
  if (notFound(value)) {
    showError(createError({
      statusCode: 404,
      statusMessage: 'Character not found',
    }))
  }
})

const character = computed(() => data.value?.character ?? null)
const episodes = computed(() => data.value?.episodes ?? [])
const locations = computed(() => data.value?.locations ?? [])
const loading = computed(() => status.value === 'pending' || status.value === 'idle')
const failed = computed(() => Boolean(error.value) && !data.value)
const errorMessage = computed(() => error.value?.statusMessage || 'Something went wrong while loading this character.')

function goBack() {
  if (typeof window.history.state?.back === 'string')
    router.back()
  else
    navigateTo('/')
}

useSeoMeta({
  title: computed(() => character.value?.name ?? 'Character'),
  description: computed(() => {
    const current = character.value
    if (!current)
      return 'Character profile from Rick and Morty.'

    return `${current.name} is a ${formatLabel(current.species)} character in Rick and Morty.`
  }),
  ogImage: computed(() => character.value?.image),
})
</script>

<template>
  <article>
    <TopBoxWrapper class="py-8  pt-24">
      <button
          class="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-mist transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portal"
          type="button"
          @click="goBack"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.5 6.5 9 12l5.5 5.5"/>
        </svg>
        Back
      </button>
      <CharacterHero v-if="character" :character="character"/>
      <div v-else class="flex items-center gap-4">
        <div class="size-24 animate-pulse rounded-md bg-thumb sm:size-36"/>
        <div class="space-y-2">
          <div class="h-6 w-40 animate-pulse rounded bg-white/10"/>
          <div class="h-3 w-28 animate-pulse rounded bg-white/10"/>
        </div>
      </div>
    </TopBoxWrapper>
    <section class="relative z-10 mx-auto py-8 md:py-16 px-4 md:max-w-[var(--desktop-width)] text-white bg-canvas text-white">
      <div
          class="relative z-10 -mx-4 bg-canvas px-4 before:pointer-events-none before:absolute before:inset-x-0 before:-top-16 before:h-16 before:bg-gradient-to-b before:from-transparent before:to-canvas sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ErrorState
            v-if="failed"
            title="Could not load this character"
            :message="errorMessage"
            @retry="refresh()"
        />
        <div v-else class="space-y-[64px]">
          <EpisodeSection :episodes="episodes" :pending="loading && !data"/>
          <LocationSection :locations="locations" :pending="loading && !data"/>
        </div>
      </div>
    </section>
  </article>
</template>
