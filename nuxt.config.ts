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
  alias: {
    // bug fix https://stackoverflow.com/a/74801367 && https://github.com/nuxt/nuxt/issues/14585
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  pages: true,
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: { apiBase: process.env.NUXT_FIREBASE_URL },
  },
});
