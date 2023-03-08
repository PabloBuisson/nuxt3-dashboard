<template>
  <div class="bg-white shadow rounded border inline-block p-4">
    <ul>
      <li>No events today</li>
      <li>24/48 todos done</li>
      <li>{{ articlesToReadMessage }}</li>
      <li>{{ articlesWrittenMessage }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const store = useTilesStore();

// Data
const tiles = computed(() => store.tiles);
const events = tiles.value.filter(
  (tile) => tile.category === TileCategory.EVENT
);
const articlesToRead = tiles.value.filter(
  (tile) => tile.category === TileCategory.TOREAD
);
const articlesToReadMessage =
  articlesToRead && articlesToRead.length > 0
    ? `${articlesToRead.length} article${articlesToRead.length > 1 ? 's' : ''} to read`
    : `No article to read`;
const articlesWritten = tiles.value.filter(
  (tile) => tile.category === TileCategory.POST
);
const articlesWrittenMessage =
  articlesWritten && articlesWritten.length > 0
    ? `${articlesWritten.length} article${articlesWritten.length > 1 ? 's' : ''} written`
    : `No article written`;
</script>
