<template>
  <div>
    <h1>Blog Post Tile</h1>
    <form @submit.prevent="onSubmit">
      <AppInput id="post-title" v-model="tile.title">Title</AppInput>
      <AppInput id="post-subtitle" v-model="tile.content.subtitle"
        >Subtitle</AppInput
      >
      <AppInput id="post-author" v-model="tile.content.author"
        >Author Name</AppInput
      >
      <AppInput id="post-thumbnail" v-model="tile.content.thumbnail"
        >Thumbnail Link</AppInput
      >
      <AppInput
        id="post-content"
        control-type="textarea"
        v-model="tile.content.content"
        >Content</AppInput
      >
      <AppInput
        id="post-preview"
        control-type="textarea"
        v-model="tile.content.previewText"
        >Preview Text</AppInput
      >
      <button
        class="px-4 py-2 font-semibold bg-cyan-500 text-white rounded shadow-sm"
        type="submit"
      >
        Update
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Tile, TileCategory } from "~~/models/tile";

interface Props {
  tile?: Tile;
}

interface Article {
  title: string;
  subtitle?: string;
  content: string;
  preview: string;
  keywords?: string[];
  thumbnail?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit"]);
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.POST,
  content: {
    title: "",
    subtitle: "",
    content: "",
    preview: "",
    keywords: [],
    thumbnail: "",
  } as Article,
  dateCreation: new Date(),
};

function onSubmit() {
  emit("submit", tile);
}
</script>

<style lang="scss" scoped></style>
