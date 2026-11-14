<script setup lang="ts">
import type {CharacterDetail} from '#shared/types/rick-and-morty'
import {readIdParam} from '#shared/utils/query'
import {formatLabel} from '~/utils/format'

definePageMeta({
  validate: route => readIdParam(route.params.id) !== null,
})

const route = useRoute()
const router = useRouter()
const id = computed(() => readIdParam(route.params.id) as number)

const {data, error, status, refresh} = await useFetch<CharacterDetail>(
    () => `/api/characters/${id.value}`,
)

if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Character not found',
    fatal: true,
  })
}

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

    return `${current.name} · ${formatLabel(current.species)} · ${formatLabel(current.status)}. Episodes and locations from Rick and Morty.`
  }),
  ogImage: computed(() => character.value?.image),
})
</script>

<template>
  <article>
    <TopBoxWrapper class="pt-24 pb-8">
      <button
          class="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-mist transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portal"
          type="button"
          @click="goBack"
      >
        <SvgoBack class="size-4 !fill-unset " aria-hidden="true"/>
        Back
      </button>

      <CharacterHero v-if="character" :character="character"/>
      <div v-else-if="loading" class="flex items-center gap-4">
        <div class="size-24 animate-pulse rounded-md bg-thumb sm:size-36"/>
        <div class="space-y-2">
          <div class="h-6 w-40 animate-pulse rounded bg-white/10"/>
          <div class="h-3 w-28 animate-pulse rounded bg-white/10"/>
        </div>
      </div>
    </TopBoxWrapper>


    <section class="relative z-10 mx-auto py-8 md:py-16 px-4 md:max-w-[var(--desktop-width)] text-white bg-canvas text-white">
      <ErrorState
          v-if="failed"
          title="Could not load this character"
          :message="errorMessage"
          @retry="refresh()"
      />
      <div v-else class="space-y-16">
        <EpisodeSection :episodes="episodes" :pending="loading && !data"/>
        <LocationSection :locations="locations" :pending="loading && !data"/>
      </div>
    </section>
  </article>
</template>