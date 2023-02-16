<template>
  <section>
    <DashboardGrid :tiles="tiles" />
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <NuxtLink to="tile/new">New tile</NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { useTilesStore } from "~~/stores/tiles-store";

definePageMeta({ title: "My Dashboard", layout: "default" });

// Store
const store = useTilesStore();
store.loadTiles().catch((error) => {
  errorMessage.value = error;
});

// Data
const errorMessage = ref(null);
const tiles = computed(() => store.tiles);
</script>
