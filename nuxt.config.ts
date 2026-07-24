export default defineNuxtConfig({
  compatibilityDate: '2025-12-30',
  modules: ['vuetify-nuxt-module'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000'
    }
  },
  css: [
    '~/assets/css/main.css',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
})
