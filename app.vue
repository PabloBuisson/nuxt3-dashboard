<template>
  <div>
    <NuxtLayout> <NuxtPage /> </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./stores/auth-store";

const authStore = useAuthStore();
authStore.initSession();
</script>
