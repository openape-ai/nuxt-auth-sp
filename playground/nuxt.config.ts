export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2025-01-01',
  openapeSp: {
    spId: 'playground',
    spName: 'Playground SP',
    sessionSecret: 'playground-secret-at-least-32-characters-long',
  },
})
