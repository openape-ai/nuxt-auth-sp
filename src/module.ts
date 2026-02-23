import { defineNuxtModule, createResolver, addServerHandler, addImportsDir, addServerImportsDir } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  spId: string
  spName: string
  sessionSecret: string
  openapeUrl: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@openape/nuxt-auth-sp',
    configKey: 'openapeSp',
  },
  defaults: {
    spId: '',
    spName: 'OpenAPE Service Provider',
    sessionSecret: 'change-me-sp-secret-at-least-32-chars-long',
    openapeUrl: '',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Inject runtime config (app values override module defaults)
    nuxt.options.runtimeConfig.openapeSp = defu(
      nuxt.options.runtimeConfig.openapeSp as Record<string, unknown> || {},
      options,
    )

    // Register server utils (auto-imported by Nitro)
    addServerImportsDir(resolve('./runtime/server/utils'))

    // Register composables (auto-imported by Vue)
    addImportsDir(resolve('./runtime/composables'))

    // Server route handlers
    addServerHandler({ route: '/api/login', method: 'post', handler: resolve('./runtime/server/api/login.post') })
    addServerHandler({ route: '/api/callback', handler: resolve('./runtime/server/api/callback.get') })
    addServerHandler({ route: '/api/logout', method: 'post', handler: resolve('./runtime/server/api/logout.post') })
    addServerHandler({ route: '/api/me', handler: resolve('./runtime/server/api/me.get') })
    addServerHandler({ route: '/.well-known/sp-manifest.json', handler: resolve('./runtime/server/routes/well-known/sp-manifest.json.get') })
  },
})
