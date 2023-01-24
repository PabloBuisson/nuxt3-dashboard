<template>
  <div>
    <h1>My new tile</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="tile.title" />
      <div v-if="tile.category === categories.TODOS">
        <div v-for="(todo, index) in content">
          <label :for="todo.id">
            <input v-model="todo.key" />
          </label>
          <input
            :id="todo.id"
            type="checkbox"
            :value="todo.id"
            v-model="todo.value"
          />
          <button @click="deleteTodo(index)" type="button">Delete</button>
        </div>
        <button @click="addTodo" type="button">Add todo</button>
      </div>
      <button
        class="px-4 py-2 font-semibold bg-cyan-500 text-white rounded shadow-sm"
        type="submit"
      >
        Update
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const store = useTilesStore();
const config = useRuntimeConfig();
const categories = TileCategory;
const tile: Tile = {
  id: "",
  title: "",
  category: TileCategory.TODOS,
  content: "",
  dateCreation: new Date(),
};

const content = ref([
  {
    key: "Todo1",
    value: false,
    id: "todo1",
  },
]);

function onSubmit() {
    tile.content = content.value;
    console.log(tile);
    store.registerTile(tile);
}

function addTodo() {
  content.value.push({
    key: `Todo${content.value?.length + 1}`,
    value: false,
    id: `todo${content.value?.length + 1}`,
  });
}

function deleteTodo(index: number) {

}
</script>

<style scoped></style>
