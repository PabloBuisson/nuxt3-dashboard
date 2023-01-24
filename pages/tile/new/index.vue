<template>
  <div>
    <h1>My new tile</h1>
    <label for="select-type">What type of tile you want to create ?</label>
    <select id="select-type" v-model="selectedCategory">
      <option
        v-for="option in categoryOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
    <TileFormTodos @submit="onSubmitted" />
  </div>
</template>

<script setup lang="ts">
import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const store = useTilesStore();

const categoryOptions = [
  { text: "Todos", value: TileCategory.TODOS },
  { text: "To read", value: TileCategory.TOREAD },
  { text: "Blog post", value: TileCategory.POST },
  { text: "Agenda", value: TileCategory.EVENT },
  { text: "Weather forecast", value: TileCategory.WEATHER },
];
const selectedCategory = ref("");

watch(selectedCategory, (newType) => {
  console.log(`selected category is ${newType}`);
});

function onSubmitted(tile: Tile) {
  console.log(tile);
  store.registerTile(tile);
}
</script>

<style scoped></style>
