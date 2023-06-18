<template>
  <div class="px-10 pb-12">
    <h1 class="text-2xl font-semibold text-purple-300 mb-8">
      {{ tilesTitle }}
    </h1>
    <NuxtPage />
    <section v-if="tiles && tiles.length > 0" class="flex flex-wrap gap-4">
      <TilePreview
        v-for="(tile, index) in tiles"
        :key="tile.id"
        :id="tile.id"
        :index="index"
        :is-group="tile.isGroup"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

// definePageMeta({ title: "My tiles", middleware: ["auth"] });
definePageMeta({ title: "My tiles" });
useHead({
  title: "My tiles",
});
const route = useRoute();
const store = useTilesStore();

const tilesCategory = route.query.category;
const tilesTitle = computed(() => {
  if (!tilesCategory) return "";
  switch (tilesCategory) {
    case TileCategory.TODOS:
      return "Todos tiles";
    case TileCategory.POST:
      return "Blog post tiles";
    case TileCategory.TOREAD:
      return "Bookmark tiles";
    default:
      return "Tiles";
  }
});
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
} else {
  navigateTo({ path: "/" }, { replace: true });
}

function getTilesFromStore() {
  tiles = store.tiles.filter((tile) => tile.category == tilesCategory);
}
</script>

<style lang="scss" scoped></style>
