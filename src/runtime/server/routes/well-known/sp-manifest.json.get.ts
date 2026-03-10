import { defineEventHandler, getRequestURL } from 'h3'
import { createSPManifest } from '@openape/auth'
import { getSpConfig } from '../../utils/sp-config'

export default defineEventHandler((event) => {
  const { clientId, spName } = getSpConfig()
  const origin = getRequestURL(event).origin
  return createSPManifest({
    client_id: clientId,
    name: spName,
    redirect_uris: [`${origin}/api/callback`],
    description: `${spName} — OpenApe Service Provider`,
  })
})
