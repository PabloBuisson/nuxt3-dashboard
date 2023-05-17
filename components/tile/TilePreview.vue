<template>
  <article class="w-full min-w-[10rem]">
    <template v-if="isGroup">
      <div class="flex justify-between w-full gap-4">
        <h1 class="text-purple-200 text-lg mb-2">{{ tile?.title }}</h1>
        <NuxtLink class="text-orange-200" v-if="isGroup" :to="tileLink"
          >see all</NuxtLink
        >
      </div>
      <div class="inline-block h-full bg-purple-800 text-purple-200 w-full shadow rounded p-4">
        <ul>
          <li v-for="article of tileContent">
            <NuxtLink :to="'/tile/' + article.id">
              <div class="flex justify-between gap-2">
                <h2>{{ article.title }}</h2>
                <span aria-hidden="true">→</span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <h1 class="text-purple-200 text-lg mb-2">{{ tile?.title }}</h1>
      <NuxtLink :to="tileLink" class="inline-block w-full h-full post-preview">
        <div class="inline-block h-full bg-purple-800 text-purple-200 w-full shadow rounded p-4">
          <template v-if="tileCategory === TileCategory.TODOS">
            <ul>
              <li v-for="todo of tileContent">
                <div class="flex justify-between items-center gap-2 bg-purple-700 px-2 py-1 mb-1 rounded">
                  <label class="max-w-[12ch] text-ellipsis overflow-hidden cursor-pointer">{{ todo.key }}</label>
                  <input
                    type="checkbox"
                    :value="todo.value"
                    :checked="todo.value"
                    class="w-4 h-4 cursor-pointer accent-purple-900 default:bg-purple-900 default:ring-0"
                  />
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="font-semibold mb-1">By {{ tileContent.author }}</p>
            <p>{{ tileContent.preview }}</p>
          </template>
        </div>
      </NuxtLink>
    </template>
  </article>
</template>

<script setup lang="ts">
import { TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

interface Props {
  id: string;
  index: number;
  isGroup?: boolean;
  urlGroup?: string;
}

const props = defineProps<Props>();
const store = useTilesStore();

let tileContent: any;
let tileCategory: TileCategory;

const tile = props.isGroup
  ? computed(() => store.groupTiles.find((tile) => tile.id === props.id))
  : computed(() => store.tiles.find((tile) => tile.id === props.id));

tileCategory = tile.value!.category;

if (!props.isGroup) {
  if (tileCategory === TileCategory.TODOS) {
    tileContent = tile.value?.content.slice(0, 3);
  } else {
    tileContent = tile.value?.content;
  }
}

if (props.isGroup) {
  tileContent = tile.value?.content;
}

const tileLink = computed(() => {
  return props.isGroup ? "/tile?category=" + props.id : "/tile/" + props.id;
});
</script>
