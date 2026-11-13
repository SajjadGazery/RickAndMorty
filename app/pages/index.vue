<script setup lang="ts">
import type { CharacterList } from '#shared/types/rick-and-morty'
import { readNameQuery, readPageQuery } from '#shared/utils/query'

const route = useRoute()
const page = computed(() => readPageQuery(route.query.page))
const name = computed(() => readNameQuery(route.query.name))

const { data, status, error, refresh } = await useAsyncData(
  computed(() => `characters:${name.value}:${page.value}`),
  () => $fetch<CharacterList>('/api/characters', {
    query: { page: page.value, name: name.value },
  }),
  { watch: [page, name] },
)

const characters = computed(() => data.value?.results ?? [])
const pages = computed(() => data.value?.info.pages ?? 0)
const loading = computed(() => status.value === 'pending' || status.value === 'idle')

const emptyDescription = computed(() =>
  name.value
    ? `Nothing matches "${name.value}". Try another name.`
    : 'No characters to show right now.',
)

const errorMessage = computed(() => error.value?.statusMessage || 'Something went wrong while loading characters.')

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage === page.value || (pages.value > 0 && nextPage > pages.value))
    return

  navigateTo({
    path: '/',
    query: {
      name: name.value || undefined,
      page: nextPage > 1 ? String(nextPage) : undefined,
    },
  })

  if (import.meta.client)
    window.scrollTo({ top: 0 })
}

useSeoMeta({
  title: computed(() => (name.value ? `Results for ${name.value}` : 'Characters')),
  description: 'Browse Rick and Morty characters and open a profile for episodes and locations.',
})
</script>

<template>
  <h1 class="sr-only">
    Rick and Morty characters
  </h1>

  <TopBoxWrapper blob-class="opacity-0 md:opacity-100" class="py-6  pt-18">
    <CharacterSearch />
  </TopBoxWrapper>

  <section
      class="relative z-10 mx-auto py-8 px-4 md:py-16 md:max-w-[var(--desktop-width)] text-white bg-canvas text-white">
    <ErrorState
        v-if="error && characters.length === 0"
        title="Could not load characters"
        :message="errorMessage"
        @retry="refresh()"
    />
    <EmptyState
        v-else-if="!loading && characters.length === 0"
        title="No characters found"
        :description="emptyDescription"
    />
    <CharacterGrid
        v-else
        :characters="characters"
        :pending="loading"
    />

    <AppPagination
        v-if="pages > 1"
        class="mt-8"
        :page="page"
        :pages="pages"
        @update:page="goToPage"
    />
  </section>
</template>
