<template>
  <div class="px-10 pb-12">
    <h1 class="text-2xl font-semibold text-purple-300 mb-8">New tile</h1>
    <label class="text-purple-100 font-semibold block mb-2" for="select-type"
      >What type of tile you want to create ?</label
    >
    <div class="flex flex-wrap gap-4 mb-12">
      <button
        @click="onClickCategory(option.value)"
        class="bg-orange-200 border-4 border-orange-300 w-[10rem] shadow-sm text-orange-800 font-semibold px-4 pt-3 pb-4 rounded flex flex-col gap-2"
        v-for="option in categoryOptions"
      >
        <label class="cursor-pointer text-lg" :for="option.text">{{
          option.text
        }}</label>
        <input
          type="radio"
          class="accent-orange-700 cursor-pointer w-4 h-4 mx-auto"
          :id="option.text"
          :value="option.value"
          v-model="selectedCategory"
        />
      </button>
    </div>

    <component :is="selectedForm" @submit="onSubmitted" />
  </div>
</template>

<script setup lang="ts">
import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

const store = useTilesStore();
const router = useRouter();

const TileFormTodos = resolveComponent("TileFormTodos");
const TileFormToRead = resolveComponent("TileFormToRead");
const TileFormBlogPost = resolveComponent("TileFormBlogPost");
const TileFormForecast = resolveComponent("TileFormForecast");
const TileFormEvent = resolveComponent("TileFormEvent");

const categoryOptions = [
  { text: "Todos", value: TileCategory.TODOS, component: TileFormTodos },
  { text: "To read", value: TileCategory.TOREAD, component: TileFormToRead },
  { text: "Blog post", value: TileCategory.POST, component: TileFormBlogPost },
  { text: "Events", value: TileCategory.EVENT, component: TileFormEvent },
];

if (store.tiles && store.tiles.length > 0) {
  if (!store.tiles.some((tile) => tile.category === TileCategory.WEATHER)) {
    categoryOptions.push({
      text: "Weather forecast",
      value: TileCategory.WEATHER,
      component: TileFormForecast,
    });
  }
}

const selectedCategory = ref("");
const selectedForm = shallowRef();

watch(selectedCategory, (newType) => {
  selectedForm.value = categoryOptions.find(
    (option) => option.value === selectedCategory.value
  )?.component;
});

function onClickCategory(optionValue: string) {
  selectedCategory.value = optionValue;
}

async function onSubmitted(tile: Tile) {
  try {
    const tileId = await store.registerTile(tile);
    useAppToaster({ message: "Yay ! Tile created.", type: "success" });
    navigateTo({ path: `/tile/${tileId}` }, { replace: true });
  } catch (errorMessage) {
    useAppToaster({ message: `${errorMessage}`, type: "danger" });
  }
}
</script>

<style scoped></style>
