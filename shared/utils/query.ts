export function readPageQuery(value: unknown): number {
  const page = typeof value === 'number' || typeof value === 'string' ? Number(value) : Number.NaN

  if (!Number.isInteger(page) || page < 1 || page > 9999)
    return 1

  return page
}

export function readNameQuery(value: unknown): string {
  if (typeof value !== 'string')
    return ''

  return value.trim().replace(/\s+/g, ' ').slice(0, 80)
}

export function readIdParam(value: unknown): number | null {
  const id = typeof value === 'number' || typeof value === 'string' ? Number(value) : Number.NaN

  if (!Number.isInteger(id) || id < 1)
    return null

  return id
}
