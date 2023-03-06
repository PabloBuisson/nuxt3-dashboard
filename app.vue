<template>
  <div>
    <NuxtLayout> <NuxtPage /> </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./stores/auth-store";

const authStore = useAuthStore();

// we called the initSetup here
// because useCookie and other composables
// doesn't work with async code
authStore.initSession();
</script>
