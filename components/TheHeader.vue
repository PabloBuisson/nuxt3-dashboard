<template>
  <header class="p-8 mb-10 bg-purple-800">
    <nav>
      <ul class="flex flex-wrap items-center justify-between gap-5">
        <NuxtLink to="/"><h1 class="text-2xl text-purple-300 uppercase">Dashboard</h1></NuxtLink>
        <template v-if="!isLoggedIn">
          <li><NuxtLink to="/admin/auth"> LogIn </NuxtLink></li>
          <li><NuxtLink to="/admin/auth"> SignUp </NuxtLink></li>
        </template>
        <template v-else>
          <li><button class="bg-purple-400 rounded px-4 py-2" type="button" @click="logout">Log Out</button></li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~~/stores/auth-store";
import { useTilesStore } from "~~/stores/tiles-store";

const authStore = useAuthStore();
const tileStore = useTilesStore();
const router = useRouter();
const route = useRoute();

const isLoggedIn = computed(() => authStore.isAuthenticated);

function logout() {
  authStore.logout();
  if (route.path === "/") {
    tileStore.loadTiles({ forceRefresh: true });
  } else {
    navigateTo(
      { path: "/", query: { forcerefresh: "true" } },
      { replace: true }
    );
  }
}
</script>

<style lang="scss" scoped></style>
