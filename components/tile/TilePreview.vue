<template>
  <NuxtLink :to="tileLink" class="post-preview">
    <div class="inline-block bg-white shadow rounded border p-4">
      <h2>{{ tile?.title }}</h2>
      <slot />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useTilesStore } from "~~/stores/tiles-store";

interface Props {
  id: string;
  isGroup?: boolean;
  urlGroup?: string;
}

const props = defineProps<Props>();
const store = useTilesStore();

const tile = props.isGroup
  ? computed(() => store.groupTiles.find((tile) => tile.id === props.id))
  : computed(() => store.tiles.find((tile) => tile.id === props.id));

const tileLink = computed(() => {
  return props.isGroup ? "/tile?category=" + props.id : "/tile/" + props.id;
});
</script>
