import { useAuthStore } from "~~/stores/auth-store";

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.server) return;
  // nuxtApp.hook("app:created", () => {
  //   console.log("app:created");
  //   const authStore = useAuthStore();
  //   authStore.initSession();
  // });
});
