export default defineEventHandler(async (event) => {
  const session = await getSpSession(event)
  await session.clear()
  return { ok: true }
})
