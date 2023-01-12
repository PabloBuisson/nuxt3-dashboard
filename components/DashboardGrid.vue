<template>
  <section class="flex flex-wrap gap-4">
    <TilePreview v-for="tile in props.tiles" :key="tile.id" :title="tile.title" :id="tile.id" />
  </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Tile } from '~~/models/tile';

const props = defineProps({
  tiles: Array as PropType<Array<Tile>>,
})
</script>
