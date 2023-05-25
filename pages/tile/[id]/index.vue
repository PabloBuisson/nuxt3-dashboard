<template>
  <div>
    <div v-if="tile">
      <component
        :is="selectedForm"
        :tile="tile"
        class="px-10 pb-12"
        @submit="onSubmitted"
        @delete="onDeleted"
        @error="onError"
      />
    </div>
    <div class="px-10 pb-12" v-else>
      <div class="bg-purple-900 p-4 rounded text-purple-200 ">
        <div class="flex gap-2 items-center mb-8">
          <Icon size="24" class="text-red-400" name="fluent:warning-24-regular" />
          <p>Oops, tile not found !</p>
        </div>
        <NuxtLink
          class="underline underline-offset-4 decoration-orange-400"
          to="/"
          >Go back to dashboard</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"; // workaround bug #6646
import { useAppToaster } from "~~/composables/useAppToaster";
import { Tile, TileCategory } from "~~/models/tile";
import { useForecastStore } from "~~/stores/forecast-store";
import { useTilesStore } from "~~/stores/tiles-store";

const route = useRoute();
const router = useRouter();
const tilesStore = useTilesStore();
const forecastStore = useForecastStore();

let selectedForm: any;
const TileFormTodos = resolveComponent("TileFormTodos");
const TileFormToRead = resolveComponent("TileFormToRead");
const TileFormBlogPost = resolveComponent("TileFormBlogPost");
const TileFormForecast = resolveComponent("TileFormForecast");
const TileFormEvent = resolveComponent("TileFormEvent");

const categoryOptions = [
  { value: TileCategory.TODOS, component: TileFormTodos },
  { value: TileCategory.TOREAD, component: TileFormToRead },
  { value: TileCategory.POST, component: TileFormBlogPost },
  { value: TileCategory.EVENT, component: TileFormEvent },
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
      await tilesStore.fetchTile(tileId as string);
      getTileFromStore();
    } catch (errorMessage) {
      useAppToaster({ message: `${errorMessage}`, type: "danger" });
    }
  }
}

function getTileFromStore() {
  tile = tilesStore.tiles.find((tile) => tile.id === tileId) as Tile;
  if (tile != null) {
    selectedForm = categoryOptions.find(
      (option) => option.value === tile.category
    )?.component;
  }
}

async function onSubmitted(tile: Tile) {
  try {
    await tilesStore.modifyTile(tile);
    useAppToaster({ message: "Yay ! Tile updated.", type: "success" });
    router.push({ path: "/" });
  } catch (errorMessage) {
    useAppToaster({ message: `${errorMessage}`, type: "danger" });
  }
}

function onError(errorMessage: string) {
  useAppToaster({ message: `${errorMessage}`, type: "danger" });
}

async function onDeleted(tileId: string, settings: { isWeatherTile: boolean }) {
  try {
    await tilesStore.deleteTile(tileId);
    useAppToaster({ message: "Tile deleted", type: "success" });
    if (settings?.isWeatherTile) {
      forecastStore.clearStore();
    }
    navigateTo({ path: "/" }, { replace: true });
  } catch (errorMessage) {
    useAppToaster({ message: `${errorMessage}`, type: "danger" });
  }
}
</script>

<style lang="scss" scoped></style>
