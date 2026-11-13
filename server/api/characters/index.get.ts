export default defineEventHandler((event) => {
  const query = getQuery(event)

  return getCharacterPage(readPageQuery(query.page), readNameQuery(query.name))
})
