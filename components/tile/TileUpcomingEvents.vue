<template>
  <div class="inline-block">
    <h2 class="text-2xl">Upcoming events</h2>
    <div class="bg-white shadow rounded border inline-block p-4">
      <ul v-for="tile in tiles" :key="tile.id">
        <li v-for="content in tile.content" :key="content">
          {{ content.key }} = {{ content.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const store = useTilesStore();
const tiles = computed(() =>
  store.tiles
    .filter((tile) => tile.category === TileCategory.EVENT)
    ?.slice(0, 3)
);
</script>

<style scoped></style>
