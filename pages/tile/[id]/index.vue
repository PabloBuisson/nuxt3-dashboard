<template>
  <div>
    <div v-if="tile">
      <component
        :is="selectedForm"
        :tile="tile"
        @submit="onSubmitted"
        @delete="onDeleted"
      />
    </div>
    <div v-else>
      <p>Oops, tile not found !</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"; // workaround bug #6646
import { useAppToaster } from "~~/composables/useAppToaster";
import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const route = useRoute();
const store = useTilesStore();
let selectedForm: any;
const TileFormTodos = resolveComponent("TileFormTodos");
const TileFormToRead = resolveComponent("TileFormToRead");
const TileFormBlogPost = resolveComponent("TileFormBlogPost");
const TileFormForecast = resolveComponent("TileFormForecast");
const TileFormAgenda = resolveComponent("TileFormAgenda");

const categoryOptions = [
  { value: TileCategory.TODOS, component: TileFormTodos },
  { value: TileCategory.TOREAD, component: TileFormToRead },
  { value: TileCategory.POST, component: TileFormBlogPost },
  { value: TileCategory.EVENT, component: TileFormAgenda },
  { value: TileCategory.WEATHER, component: TileFormForecast },
];

const tileId = route.params.id;
let tile: Tile;
if (tileId) {
  if (process.client) {
    getTileFromStore();
  }

  if (process.server) {
    try {
      await store.fetchTile(tileId as string);
      getTileFromStore();
    } catch (errorMessage) {
      useAppToaster({ message: `${errorMessage}`, type: "danger" });
    }
  }
}

function getTileFromStore() {
  tile = store.tiles.find((tile) => tile.id === tileId) as Tile;
  if (tile != null) {
    selectedForm = categoryOptions.find(
      (option) => option.value === tile.category
    )?.component;
  }
}

async function onSubmitted(tile: Tile) {
  try {
    await store.modifyTile(tile);
    useAppToaster({ message: "Yay ! Tile updated.", type: "success" });
  } catch (errorMessage) {
    useAppToaster({ message: `${errorMessage}`, type: "danger" });
  }
}

function onDeleted(tileId: string) {
  store.deleteTile(tileId);
}
</script>

<style lang="scss" scoped></style>
