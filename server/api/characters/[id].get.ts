export default defineEventHandler((event) => {
  const id = readIdParam(getRouterParam(event, 'id'))

  if (id === null) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Character not found',
    })
  }

  return getCharacterDetail(id)
})
