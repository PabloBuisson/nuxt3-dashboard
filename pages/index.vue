<template>
  <section>
    <DashboardGrid :tiles="tiles" />
    <NuxtLink to="tile/new">New tile</NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { useTilesStore } from "~~/stores/tiles-store";

definePageMeta({ title: "My Dashboard", layout: "default" });

// Store
const store = useTilesStore();
try {
  await store.loadTiles();
} catch (errorMessage) {
  useAppToaster({ message: `${errorMessage}`, type: "danger" });
}

// Data
const tiles = computed(() => store.tiles);
</script>
