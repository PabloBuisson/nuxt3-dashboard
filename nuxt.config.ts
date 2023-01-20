// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // automatically imports `defineStore`
          "defineStore", // import { defineStore } from 'pinia'
        ],
      },
    ],
  ],
  pages: true,
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: { apiBase: process.env.NUXT_FIREBASE_URL },
  },
});
