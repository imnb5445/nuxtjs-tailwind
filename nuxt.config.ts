// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  supabase: {
    redirect: false
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  compatibilityDate: '2024-09-13',
});