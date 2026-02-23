import type { H3Event } from 'h3'
import type { AuthFlowState } from '@openape/core'

const FLOW_COOKIE = 'openape-flow'

export function getSpConfig() {
  const config = useRuntimeConfig()
  return {
    spId: config.openapeSp.spId || 'sp.example.com',
    openapeUrl: config.openapeSp.openapeUrl || '',
    spName: config.openapeSp.spName || 'OpenAPE Service Provider',
  }
}

export async function saveFlowState(event: H3Event, state: string, flow: AuthFlowState) {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    name: FLOW_COOKIE,
    password: config.openapeSp.sessionSecret,
    maxAge: 600,
  })
  await session.update({
    state,
    flow,
    exp: Date.now() + 10 * 60 * 1000,
  })
}

export async function getFlowState(event: H3Event, expectedState: string): Promise<AuthFlowState | null> {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    name: FLOW_COOKIE,
    password: config.openapeSp.sessionSecret,
  })
  const data = session.data
  if (!data?.state) return null
  if (data.state !== expectedState) return null
  if ((data.exp as number) < Date.now()) return null
  return data.flow as AuthFlowState
}

export async function clearFlowState(event: H3Event) {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    name: FLOW_COOKIE,
    password: config.openapeSp.sessionSecret,
  })
  await session.clear()
}
