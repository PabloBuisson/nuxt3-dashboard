<template>
  <div>
    <h1>Agenda tile</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="tile.title" />
      <div v-for="(event, index) in content">
        <label :for="event.id">
          <input v-model="event.key" />
        </label>
        <input
          placeholder="DD/MM/YYYY"
          maxlength="10"
          :id="event.id"
          v-date
          v-model="event.value"
        />
        <button @click="deleteEvent(index)" type="button">Delete</button>
      </div>
      <button @click="addEvent" type="button">Add event</button>
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

interface Event {
  key: string;
  value: string;
  id: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit"]);
const vDate = {
  mounted: (element: HTMLInputElement) => {
    element.addEventListener("keypress", function (event) {
      // prevent non-numeric value
      // key should be "1", "2, "3", ect.
      if (event.key != "/" && isNaN(+event.key)) {
        event.preventDefault();
      }

      const inputLength: number = element.value.length;

      // If we're at a particular place, let the user type the slash
      // i.e., 12/12/1212
      if (inputLength !== 1 || inputLength !== 3) {
        if (event.key == "/") {
          event.preventDefault();
        }
      }

      // If they don't add the slash, do it for them...
      if (inputLength === 2) {
        if (+element.value > 31) {
          element.value = "31";
        }
        element.value += "/";
      }

      // If they don't add the slash, do it for them...
      if (inputLength === 5) {
        if (+element.value.substring(3, 5) > 12) {
          element.value = element.value.substring(0, 3) + "12";
        }
        element.value += "/";
      }
    });
  },
};

const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.EVENT,
  content: "",
  dateCreation: new Date(),
};

if (props.tile && props.tile.content?.length > 0) {
  props.tile.content.sort(
    (a: Event, b: Event) => dateStringToDate(a.value).getTime() - dateStringToDate(b.value).getTime()
  );
}

const content = props.tile
  ? ref(props.tile.content as Event[])
  : ref([
      {
        key: "Event1",
        value: "",
        id: "1",
      },
    ]);

function onSubmit() {
  tile.content = content.value;
  emit("submit", tile);
}

function addEvent() {
  const todosLength = content.value.length;
  const lastTodoId = content.value[todosLength - 1].id;
  content.value.push({
    key: `Event${+lastTodoId + 1}`,
    value: "",
    id: `${+lastTodoId + 1}`,
  });
}

function deleteEvent(index: number) {
  const todoToDelete = content.value[index];
  content.value = content.value.filter((todo) => todo.id !== todoToDelete.id);
}

function dateStringToDate(date: string) {
  const dateElements = date.split("/");
  return new Date(+dateElements[2], +dateElements[1] - 1, +dateElements[0]);
}
</script>

<style lang="scss" scoped></style>
