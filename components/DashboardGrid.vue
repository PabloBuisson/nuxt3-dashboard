<template>
  <section class="flex flex-wrap gap-4">
    <TilePreview v-for="tile in tiles" :key="tile.id" :id="tile.id" />
  </section>
</template>

<script setup lang="ts">
import { useTilesStore } from '~~/stores/tiles-store';

const store = useTilesStore();
const tiles = computed(() => store.tiles);
</script>
