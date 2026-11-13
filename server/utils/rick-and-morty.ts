import type { Character, CharacterDetail, CharacterList, Episode, LifeStatus, Place } from '#shared/types/rick-and-morty'

const API = 'https://rickandmortyapi.com/api'

interface ApiRef {
  name: string
  url: string
}

interface ApiCharacter {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: ApiRef
  location: ApiRef
  image: string
  episode: string[]
}

interface ApiEpisode {
  id: number
  name: string
  air_date: string
  episode: string
}

interface ApiLocation {
  id: number
  name: string
  type: string
  dimension: string
}

interface ApiList<T> {
  info?: {
    count?: number
    pages?: number
  }
  results?: T[]
}

function statusOf(error: unknown): number | null {
  if (!error || typeof error !== 'object' || !('statusCode' in error))
    return null

  const status = Number(error.statusCode)
  return Number.isInteger(status) ? status : null
}

function readStatus(value: string): LifeStatus {
  if (value === 'Alive' || value === 'Dead')
    return value

  return 'unknown'
}

function idFromUrl(url: string): number | null {
  if (!url)
    return null

  const id = Number(url.split('/').pop())
  return Number.isInteger(id) && id > 0 ? id : null
}

async function api<T>(path: string, query?: Record<string, string | number>): Promise<T> {
  try {
    return await $fetch<T>(`${API}${path}`, {
      query,
      timeout: 8000,
    })
  }
  catch (error) {
    if (statusOf(error) === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'The character service is unavailable',
    })
  }
}

function toCharacter(character: ApiCharacter): Character {
  return {
    id: character.id,
    name: character.name,
    status: readStatus(character.status),
    species: character.species,
    type: character.type,
    gender: character.gender,
    image: character.image,
    origin: character.origin.name,
    location: character.location.name,
  }
}

async function fetchMany<T>(resource: 'episode' | 'location', ids: number[]): Promise<T[]> {
  const unique = [...new Set(ids)]

  if (unique.length === 0)
    return []

  const chunks: number[][] = []

  for (let index = 0; index < unique.length; index += 20)
    chunks.push(unique.slice(index, index + 20))

  const groups = await Promise.all(
    chunks.map(chunk => api<T | T[]>(`/${resource}/${chunk.join(',')}`)),
  )

  return groups.flatMap(group => Array.isArray(group) ? group : [group])
}

function roleLabel(roles: Array<'origin' | 'residence'>): string {
  const origin = roles.includes('origin')
  const residence = roles.includes('residence')

  if (origin && residence)
    return 'Origin & residence'

  return origin ? 'Origin' : 'Last known location'
}

async function loadEpisodes(urls: string[]): Promise<Episode[]> {
  const ids = urls.map(idFromUrl).filter((id): id is number => id !== null)
  const records = await fetchMany<ApiEpisode>('episode', ids)

  return records
    .map(episode => ({
      id: episode.id,
      name: episode.name,
      code: episode.episode,
      airDate: episode.air_date,
    }))
    .sort((left, right) => left.code.localeCompare(right.code, 'en', { numeric: true }))
}

async function loadLocations(character: ApiCharacter): Promise<Place[]> {
  const seeds = [
    { role: 'origin' as const, place: character.origin },
    { role: 'residence' as const, place: character.location },
  ]
  const grouped = new Map<string, { roles: Array<'origin' | 'residence'>, place: ApiRef }>()

  for (const seed of seeds) {
    const key = seed.place.url || `name:${seed.place.name}`
    const existing = grouped.get(key)

    if (existing)
      existing.roles.push(seed.role)
    else
      grouped.set(key, { roles: [seed.role], place: seed.place })
  }

  const entries = [...grouped.values()]
  const ids = entries
    .map(entry => idFromUrl(entry.place.url))
    .filter((id): id is number => id !== null)
  const records = await fetchMany<ApiLocation>('location', ids)
  const byId = new Map(records.map(record => [record.id, record]))

  return entries.map((entry) => {
    const id = idFromUrl(entry.place.url)
    const record = id ? byId.get(id) : undefined

    return {
      id,
      name: record?.name || entry.place.name,
      role: roleLabel(entry.roles),
      type: record?.type || '',
      dimension: record?.dimension || '',
    }
  })
}

export async function getCharacterPage(page: number, name: string): Promise<CharacterList> {
    try {
      const response = await api<ApiList<ApiCharacter>>('/character', {
        page,
        ...(name ? { name } : {}),
      })

      return {
        info: {
          count: response.info?.count ?? 0,
          pages: response.info?.pages ?? 0,
        },
        results: (response.results ?? []).map(toCharacter),
      }
    }
    catch (error) {
      if (statusOf(error) === 404)
        return { info: { count: 0, pages: 0 }, results: [] }

      throw error
    }
}

export async function getCharacterDetail(id: number): Promise<CharacterDetail> {
    const character = await api<ApiCharacter>(`/character/${id}`)
    const [episodes, locations] = await Promise.all([
      loadEpisodes(character.episode),
      loadLocations(character),
    ])

    return {
      character: toCharacter(character),
      episodes,
      locations,
    }
}
