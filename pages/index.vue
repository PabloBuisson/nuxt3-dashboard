<template>
  <div class="bg-slate-600 h-screen">
    <h1 class="text-4xl">My dashboard</h1>
    <DashboardGrid :tiles="tiles" />
  </div>
</template>

<script setup lang="ts">
import { useTilesStore } from '~~/stores/tiles-store';

const store = useTilesStore();

const tiles = computed(() => store.tiles);
</script>