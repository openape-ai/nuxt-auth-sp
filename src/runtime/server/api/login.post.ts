import { createAuthorizationURL, discoverIdP } from '@openape/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string }>(event)
  const { spId, openapeUrl } = getSpConfig()
  const origin = getRequestURL(event).origin
  const redirectUri = `${origin}/api/callback`

  if (!body?.email || !body.email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email required' })
  }

  const email = body.email.trim()
  const domain = email.split('@')[1]

  // Use configured IdP URL (dev/test) or discover via DNS
  let idpConfig
  if (openapeUrl) {
    idpConfig = { idpUrl: openapeUrl, record: { idp: openapeUrl } }
  } else {
    idpConfig = await discoverIdP(email)
  }

  if (!idpConfig) {
    throw createError({
      statusCode: 404,
      statusMessage: `No DDISA IdP found for domain "${domain}"`,
    })
  }

  const { url, flowState } = await createAuthorizationURL(idpConfig, {
    spId,
    redirectUri,
    email,
  })

  await saveFlowState(event, flowState.state, flowState)

  return { redirectUrl: url }
})
