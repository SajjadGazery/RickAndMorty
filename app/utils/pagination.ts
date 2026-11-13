export type PageItem = number | 'gap'

export function buildPageItems(page: number, pages: number): PageItem[] {
  if (pages < 1)
    return []

  const visible = new Set<number>([1, pages, page - 1, page, page + 1])

  if (page <= 3) {
    visible.add(2)
    visible.add(3)
    visible.add(4)
  }

  if (page >= pages - 2) {
    visible.add(pages - 1)
    visible.add(pages - 2)
    visible.add(pages - 3)
  }

  const sorted = [...visible]
    .filter(item => item >= 1 && item <= pages)
    .sort((left, right) => left - right)

  const items: PageItem[] = []

  for (const item of sorted) {
    const previous = items.at(-1)

    if (typeof previous === 'number' && item - previous > 1)
      items.push('gap')

    items.push(item)
  }

  return items
}
