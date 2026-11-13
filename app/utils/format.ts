export function formatLabel(value: string | null | undefined): string {
  const text = value?.trim()

  if (!text || text.toLowerCase() === 'unknown')
    return 'Unknown'

  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function placeMeta(type: string, dimension: string): string {
  const parts = [type, dimension]
    .map(part => formatLabel(part))
    .filter(part => part !== 'Unknown')

  return parts.length > 0 ? parts.join(' · ') : 'Unknown'
}
