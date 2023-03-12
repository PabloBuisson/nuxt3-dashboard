<template>
  <div class="flex justify-between">
    <section>
      <h1 class="text-4xl">Friday, 03 February 2023</h1>
      <TileSummary />
      <TileUpcomingEvents />
      <DashboardGrid />
      <NuxtLink to="tile/new">New tile</NuxtLink>
    </section>
    <section>
      <DashboardSidebar />
    </section>
  </div>
</template>

<script setup lang="ts">
import TileUpcomingEvents from "~~/components/Tile/TileUpcomingEvents.vue";
import { useTilesStore } from "~~/stores/tiles-store";

definePageMeta({ title: "My Dashboard", layout: "default" });

const store = useTilesStore();
try {
  await store.loadTiles();
} catch (errorMessage) {
  useAppToaster({ message: `${errorMessage}`, type: "danger" });
}
</script>
