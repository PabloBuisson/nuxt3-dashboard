<template>
  <div>
    <h1>My tiles</h1>
    <NuxtPage />
    <section v-if="tiles && tiles.length > 0" class="flex flex-wrap gap-4">
      <TilePreview
        v-for="tile in tiles"
        :key="tile.id"
        :id="tile.id"
        :is-group="tile.isGroup"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { Tile } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

definePageMeta({ title: "My tiles", middleware: ["auth"] });

const route = useRoute();
const store = useTilesStore();

const tilesCategory = route.query.category;
let tiles: Tile[];

if (tilesCategory) {
  if (process.client) {
    getTilesFromStore();
  } else if (process.server) {
    try {
      await store.loadTiles();
      getTilesFromStore();
    } catch (errorMessage) {
      useAppToaster({ message: `${errorMessage}`, type: "danger" });
    }
  }
}

function getTilesFromStore() {
  tiles = store.tiles.filter((tile) => tile.category == tilesCategory);
}
</script>

<style lang="scss" scoped></style>
