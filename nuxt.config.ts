// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@tailvue/nuxt",
    "nuxt-icon",
    "@vueuse/nuxt",
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
    public: {
      apiBase: process.env.NUXT_FIREBASE_URL,
      apiKey: process.env.NUXT_FIREBASE_API_KEY,
      apiAuthSignup: process.env.NUXT_FIREBASE_AUTH_SIGNUP_ENTRYPOINT,
      apiAuthLogin: process.env.NUXT_FIREBASE_AUTH_LOGIN_ENTRYPOINT,
      apiRefreshToken: process.env.NUXT_FIREBASE_REFRESH_TOKEN_ENTRYPOINT,
    },
  },
});
