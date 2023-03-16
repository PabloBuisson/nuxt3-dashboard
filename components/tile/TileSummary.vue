<template>
  <div class="bg-white shadow rounded border inline-block p-4">
    <ul>
      <li>{{ eventsTodayMessage }}</li>
      <li>{{ todoDoneMessage }}</li>
      <li>{{ articlesToReadMessage }}</li>
      <li>{{ articlesWrittenMessage }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { TileCategory, TileContentTodo } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const store = useTilesStore();

// Data
const tiles = computed(() => store.tiles);

// Template
let eventsTodayMessage = computed(() => getEventsOfToday());
let todoDoneMessage = computed(() => getTodoDone());
let articlesToReadMessage = computed(() => getArticlesToRead());
let articlesWrittenMessage = computed(() => getArticlesWritten());

function getEventsOfToday() {
  const events = tiles.value.filter(
    (tile) => tile.category === TileCategory.EVENT
  );
  const eventsToday = [];

  if (events && events.length > 0) {
    for (const event of events) {
      for (const date of event.content) {
        if (useDateStringToDate(date.value).toDateString() === new Date().toDateString()) {
          eventsToday.push({ ...date, tileId: event.id });
        }
      }
    }
  }

  if (eventsToday.length > 0) {
    return `${eventsToday.length} event${
      eventsToday.length > 1 ? "s" : ""
    } today`;
  } else {
    return "No events today";
  }
}

function getTodoDone() {
  let todosCreated = 0;
  let todosDone = 0;

  const todoTiles = tiles.value.filter(
    (tile) => tile.category === TileCategory.TODOS
  );

  if (todoTiles && todoTiles.length > 0) {
    for (const todoTile of todoTiles) {
      for (const todo of todoTile.content as TileContentTodo[]) {
        todosCreated = todosCreated + 1;
        if (todo.value) {
          todosDone = todosDone + 1;
        }
      }
    }
  }

  if (todosCreated > 0) {
    return `${todosDone}/${todosCreated} ${
      todosDone > 1 ? "todos" : "todo"
    } done`;
  } else {
    return "No todo created (yet)";
  }
}

function getArticlesToRead() {
  const articlesToRead = tiles.value.filter(
    (tile) => tile.category === TileCategory.TOREAD
  );
  return articlesToRead && articlesToRead.length > 0
    ? `${articlesToRead.length} article${
        articlesToRead.length > 1 ? "s" : ""
      } to read`
    : `No article to read`;
}

function getArticlesWritten() {
  const articlesWritten = tiles.value.filter(
    (tile) => tile.category === TileCategory.POST
  );
  return articlesWritten && articlesWritten.length > 0
    ? `${articlesWritten.length} article${
        articlesWritten.length > 1 ? "s" : ""
      } written`
    : `No article written`;
}
</script>
