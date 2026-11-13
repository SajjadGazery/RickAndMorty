export type LifeStatus = 'Alive' | 'Dead' | 'unknown'

export interface Character {
  id: number
  name: string
  status: LifeStatus
  species: string
  type: string
  gender: string
  image: string
  origin: string
  location: string
}

export interface CharacterList {
  info: {
    count: number
    pages: number
  }
  results: Character[]
}

export interface Episode {
  id: number
  name: string
  code: string
  airDate: string
}

export interface Place {
  id: number | null
  name: string
  role: string
  type: string
  dimension: string
}

export interface CharacterDetail {
  character: Character
  episodes: Episode[]
  locations: Place[]
}
