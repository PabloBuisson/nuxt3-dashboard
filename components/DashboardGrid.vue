<template>
  <section class="flex flex-wrap gap-4">
    <TilePreview
      v-for="tile in tilesToDisplay"
      :key="tile.id"
      :id="tile.id"
      :is-group="tile.isGroup"
    />
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
      tile.category !== TileCategory.EVENT
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

  return tilesGroup;
}

function getTilesByCategory(
  category: TileCategory,
  title: string
): Tile | null {
  const tileCategory = tiles.value
    .filter((tile) => tile.category === category)
    ?.slice(0, 3);

  if (tileCategory && tileCategory.length > 0) {
    const tileToDisplay: Tile = {
      id: category,
      title: title,
      isGroup: true,
      category: category,
      dateCreation: new Date(),
      content: tileCategory,
    };
    store.addGroupTile(tileToDisplay);
    return tileToDisplay;
  }
  return null;
}
</script>
