import { useAuthStore } from "~~/stores/auth-store";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("[Middleware : Auth] Check if user is authenticated");

  // skip middleware on server
  // we need to know if the client was able to log in automatically
  if (process.server) return;
  
  const store = useAuthStore();
  if (!store.isAuthenticated) {
    return navigateTo("/admin/auth");
  }
})
