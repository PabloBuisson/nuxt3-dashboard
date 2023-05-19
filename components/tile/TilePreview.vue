<template>
  <article class="w-full min-w-[10rem] max-w-xl">
    <template v-if="isGroup">
      <div class="flex justify-between w-full gap-4">
        <h1 class="text-purple-200 text-lg mb-2">{{ tile?.title }}</h1>
        <NuxtLink class="text-orange-300" v-if="isGroup" :to="tileLink"
          >see all</NuxtLink
        >
      </div>
      <div
        class="inline-block h-[9.75rem] overflow-hidden bg-purple-800 text-purple-200 w-full shadow rounded p-3"
      >
        <ul>
          <li
            class="bg-purple-700 [&:not(:last-child)]:mb-[0.375rem] rounded"
            v-for="article of tileContent"
          >
            <NuxtLink :to="'/tile/' + article.id">
              <div class="flex justify-between items-stretch gap-2">
                <h2 class="px-3 py-2">{{ article.title }}</h2>
                <div class="flex items-center justify-center px-2 bg-purple-900 rounded-r">
                  <Icon
                    aria-hidden="true"
                    size="20"
                    name="fluent:arrow-right-24-filled"
                  />
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center gap-2 mb-2">
        <h1 class="text-purple-200 text-lg">{{ tile?.title }}</h1>
        <AppIconLink
          :link="tileLink"
          link-label="Modify"
          icon-size="14"
          icon-name="fluent:edit-24-filled"
        />
      </div>
      <NuxtLink :to="tileLink" class="inline-block w-full h-full post-preview">
        <div
          class="inline-block h-[9.75rem] overflow-hidden bg-purple-800 text-purple-200 w-full shadow rounded p-3"
        >
          <template v-if="tileCategory === TileCategory.TODOS">
            <ul>
              <li
                v-for="todo of tileContent"
                class="flex justify-between items-center gap-2 bg-purple-700 px-3 py-2 [&:not(:last-child)]:mb-[0.375rem] rounded"
              >
                <label
                  class="max-w-[12ch] text-ellipsis overflow-hidden cursor-pointer"
                  >{{ todo.key }}</label
                >
                <input
                  type="checkbox"
                  :value="todo.value"
                  :checked="todo.value"
                  class="w-5 h-5 cursor-pointer accent-purple-900 default:bg-purple-900 default:ring-0"
                />
              </li>
            </ul>
          </template>
          <template v-else>
            <div class="px-1">
              <p class="font-semibold mb-1">By {{ tileContent.author }}</p>
              <p class="line-clamp-4">{{ tileContent.preview }}</p>
            </div>
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
