<template>
  <div>
    <div v-if="tile">
      <form @submit.prevent="onSubmit">
        <input v-model="tile.title" />
        <!-- <h1>{{ tile.title }}</h1> -->
        <div v-if="tile.category === categories.TODOS">
          <div v-for="todo in tile.content">
            <label :for="todo.id">{{ todo.key }}</label>
            <input
              :id="todo.id"
              type="checkbox"
              :value="todo.id"
              v-model="todo.value"
            />
          </div>
        </div>
        <button
          class="px-4 py-2 font-semibold bg-cyan-500 text-white rounded shadow-sm"
          type="submit"
        >
          Update
        </button>
      </form>
    </div>
    <div v-else>
      <p>Oops, tile not found !</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"; // workaround bug #6646
import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const route = useRoute();
const store = useTilesStore();
const config = useRuntimeConfig();
const categories = TileCategory;

const tileId = route.params.id;
let tile: Tile;
if (tileId) {
  tile = store.tiles.find((tile) => tile.id === tileId) as Tile;
}

// post tile in Firebase

interface FirebasePOSTResponse {
  name: string;
}

async function onSubmit() {
  console.log("sumbitted", tile);
  console.log("Firebase url", config.public.apiBase);

  const { data, pending, error, refresh } = await useFetch<FirebasePOSTResponse>(`tiles.json`, {
    method: "POST",
    body: tile,
    baseURL: config.public.apiBase,
  });

  // tile.id = data.value?.name; FOR NEW POSTS

  store.addTile(tile);

  console.log(data.value?.name);
}

// get infos of tile in Firebase
// display infos
</script>

<style lang="scss" scoped></style>
