<template>
  <div class="bg-slate-600 h-screen">
    <h1 class="text-4xl">My dashboard</h1>
    <DashboardGrid :tiles="tiles" />
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <NuxtLink to="tile/new">New tile</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useTilesStore } from "~~/stores/tiles-store";

// Store
const store = useTilesStore();
store.loadTiles().catch((error) => {
  errorMessage.value = error;
});

// Data
const errorMessage = ref(null);
const tiles = computed(() => store.tiles);
</script>
