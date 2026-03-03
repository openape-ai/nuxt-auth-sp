import { defineNuxtModule, createResolver, addServerHandler, addImportsDir, addServerImportsDir } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  spId: string
  spName: string
  sessionSecret: string
  openapeUrl: string
  fallbackIdpUrl: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@openape/nuxt-auth-sp',
    configKey: 'openapeSp',
  },
  defaults: {
    spId: '',
    spName: 'OpenApe Service Provider',
    sessionSecret: 'change-me-sp-secret-at-least-32-chars-long',
    openapeUrl: '',
    fallbackIdpUrl: 'https://id.openape.at',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Inject runtime config (app values override module defaults)
    nuxt.options.runtimeConfig.openapeSp = defu(
      nuxt.options.runtimeConfig.openapeSp as Record<string, unknown> || {},
      options,
    ) as typeof options

    // Register server utils (available via #imports or auto-import)
    addServerImportsDir(resolve('./runtime/server/utils'))

    // Register composables (auto-imported by Vue)
    addImportsDir(resolve('./runtime/composables'))

    // Register server handlers directly.
    // All handlers use explicit h3 imports so they work with or without auto-imports.
    // Consumer projects should add @openape/nuxt-auth-sp to nitro.externals.inline
    // and set nitro.imports.autoImport = false for reliable Vercel deployments.
    addServerHandler({ route: '/api/login', method: 'post', handler: resolve('./runtime/server/api/login.post') })
    addServerHandler({ route: '/api/callback', handler: resolve('./runtime/server/api/callback.get') })
    addServerHandler({ route: '/api/logout', method: 'post', handler: resolve('./runtime/server/api/logout.post') })
    addServerHandler({ route: '/api/me', handler: resolve('./runtime/server/api/me.get') })
    addServerHandler({ route: '/.well-known/sp-manifest.json', handler: resolve('./runtime/server/routes/well-known/sp-manifest.json.get') })
  },
})
