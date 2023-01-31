<template>
  <div>
    <h1>Todos Tile</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="tile.title" />
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
        <button v-if="index > 0" @click="deleteTodo(index)" type="button">
          Delete
        </button>
      </div>
      <button @click="addTodo" type="button">Add todo</button>
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

interface Props {
  tile?: Tile;
}

interface Todo {
  key: string;
  value: boolean;
  id: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit"]);

const categories = TileCategory;
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.TODOS,
  content: "",
  dateCreation: new Date(),
};

const content = props.tile
  ? ref(props.tile.content as Todo[])
  : ref([
      {
        key: "Todo1",
        value: false,
        id: "1",
      },
    ]);

function onSubmit() {
  tile.content = content.value;
  emit("submit", tile);
}

function addTodo() {
  const todosLength = content.value.length;
  const lastTodoId = content.value[todosLength - 1].id;
  content.value.push({
    key: `Todo${+lastTodoId + 1}`,
    value: false,
    id: `${+lastTodoId + 1}`,
  });
}

function deleteTodo(index: number) {
  const todoToDelete = content.value[index];
  content.value = content.value.filter((todo) => todo.id !== todoToDelete.id);
}
</script>

<style lang="scss" scoped></style>
