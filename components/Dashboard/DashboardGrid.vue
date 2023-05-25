<template>
  <section class="flex flex-wrap gap-8">
    <TilePreview
      v-for="(tile, index) in tilesToDisplay"
      :key="tile.content"
      :index="index"
      :id="tile.id"
      :is-group="tile.isGroup"
      class="basis-1/3 grow"
    />
    <NuxtLink
      class="inline-block basis-1/3 grow min-w-[10rem] mt-8 p-8 border-2 border-dashed border-purple-500 rounded text-purple-300"
      to="tile/new"
    >
      <div class="flex flex-col items-center justify-center gap-4">
        <Icon aria-hidden="true" size="40" name="fluent:add-24-filled" />
        <span class="font-semibold text-lg">Add a tile</span>
      </div>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const store = useTilesStore();
const tiles = computed(() =>
  store.tiles.filter(
    (tile) =>
      tile.category !== TileCategory.WEATHER &&
      tile.category !== TileCategory.EVENT &&
      tile.isPinned
  )
);
const tilesToDisplay = computed(() => [...tiles.value, ...getTileGroup()]);

function getTileGroup(): Tile[] {
  let tilesGroup: Tile[] = [];

  const tileBookmarks = getTilesByCategory(
    TileCategory.TOREAD,
    "Last bookmarks"
  );
  if (tileBookmarks) {
    tilesGroup = [tileBookmarks];
  }

  const tilePosts = getTilesByCategory(TileCategory.POST, "Last posts");
  if (tilePosts) {
    tilesGroup = [...tilesGroup, tilePosts];
  }

  const tileTodos = getTilesByCategory(TileCategory.TODOS, "Last todos");
  if (tileTodos) {
    tilesGroup = [...tilesGroup, tileTodos];
  }

  return tilesGroup;
}

function getTilesByCategory(
  category: TileCategory,
  title: string
): Tile | null {
  const tileCategory = computed(() =>
    store.tiles
      .filter((tile) => tile.category === category && !tile.isPinned)
      ?.slice(0, 3)
  );

  if (tileCategory && tileCategory.value.length > 0) {
    const tileToDisplay: Tile = {
      id: category,
      title: title,
      isGroup: true,
      category: category,
      dateCreation: new Date(),
      content: tileCategory.value,
    };
    store.addGroupTile(tileToDisplay);
    return tileToDisplay;
  }
  return null;
}
</script>
