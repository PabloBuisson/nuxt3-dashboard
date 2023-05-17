<template>
  <div class="min-w-[10rem] bg-purple-800 shadow text-purple-200 rounded inline-block py-4 px-6">
    <ul>
      <li class="relative pl-6 text-purple-100 before:content[''] before:top-0 before:bottom-0 before:my-auto before:left-0 before:right-0 before:absolute before:h-2 before:w-2 before:rounded-full before:border-2 before:border-purple-400">{{ eventsTodayMessage }}</li>
      <li class="relative pl-6 text-purple-100 before:content[''] before:top-0 before:bottom-0 before:my-auto before:left-0 before:right-0 before:absolute before:h-2 before:w-2 before:rounded-full before:border-2 before:border-blue-400">{{ todoDoneMessage }}</li>
      <li class="relative pl-6 text-purple-100 before:content[''] before:top-0 before:bottom-0 before:my-auto before:left-0 before:right-0 before:absolute before:h-2 before:w-2 before:rounded-full before:border-2 before:border-purple-400">{{ articlesToReadMessage }}</li>
      <li class="relative pl-6 text-purple-100 before:content[''] before:top-0 before:bottom-0 before:my-auto before:left-0 before:right-0 before:absolute before:h-2 before:w-2 before:rounded-full before:border-2 before:border-blue-400">{{ articlesWrittenMessage }}</li>
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
