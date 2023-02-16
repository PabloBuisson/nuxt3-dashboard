import { useAuthStore } from "~~/stores/auth-store";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("[Middleware : Auth] Check if user is authenticated");
  const store = useAuthStore();
  if (!store.isAuthenticated) {
    return navigateTo("/admin/auth");
  }
})
