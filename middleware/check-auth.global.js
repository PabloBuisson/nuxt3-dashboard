import { useAuthStore } from "~~/stores/auth-store";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("[Middleware : Check Auth] Check if token is valid");
  const store = useAuthStore();
  store.handleSession();
});
