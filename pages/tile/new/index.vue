<template>
  <div>
    <h1>My new tile</h1>
    <label for="select-type">What type of tile you want to create ?</label>
    <select id="select-type" v-model="selectedCategory">
      <option
        v-for="option in categoryOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
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
const TileFormAgenda = resolveComponent("TileFormAgenda");

const categoryOptions = [
  { text: "Todos", value: TileCategory.TODOS, component: TileFormTodos },
  { text: "To read", value: TileCategory.TOREAD, component: TileFormToRead },
  { text: "Blog post", value: TileCategory.POST, component: TileFormBlogPost },
  { text: "Agenda", value: TileCategory.EVENT, component: TileFormAgenda },
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

async function onSubmitted(tile: Tile) {
  try {
    const tileId = await store.registerTile(tile);
    useAppToaster({ message: "Yay ! Tile created.", type: "success" });
    router.replace({ path: `/tile/${tileId}` });
  } catch (errorMessage) {
    useAppToaster({ message: `${errorMessage}`, type: "danger" });
  }
}
</script>

<style scoped></style>
