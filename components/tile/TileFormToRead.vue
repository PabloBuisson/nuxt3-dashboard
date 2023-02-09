<template>
  <div>
    <h1>Bookmark Tile</h1>
    <form @submit.prevent="onSubmit">
      <AppInput id="post-title" v-model="formData.title">Title</AppInput>
      <AppInput
        id="post-subtitle"
        control-type="textarea"
        v-model="formData.summary"
        >Summary</AppInput
      >
      <AppInput id="post-author" v-model="formData.author"
        >Author Name</AppInput
      >
      <AppInput id="post-content" v-model="formData.link">Link</AppInput>
      <AppInput id="post-thumbnail" v-model="formData.thumbnail"
        >Thumbnail Link</AppInput
      >
      <AppInput
        id="post-preview"
        control-type="textarea"
        v-model="formData.preview"
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

type FormData = {
  [propName in keyof Article]: ModelValue;
};

interface Article {
  title: string;
  link: string;
  summary: string;
  author: string;
  preview: string;
  keywords: string[];
  thumbnail: string;
}

const props = defineProps<Props>();
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.TOREAD,
  content: {},
  dateCreation: new Date(),
};
let formIsValid = true;
const isEditPage = computed(() => tile.id !== "");

const formData: FormData = {
  title: {
    value: props?.tile?.title ?? "",
    isValid: true,
    validators: ["required"]
  },
  link: {
    value: props?.tile?.content?.link ?? "",
    isValid: true,
    validators: ["required"]
  },
  author: {
    value: props?.tile?.content?.author ?? "",
    isValid: true,
  },
  summary: {
    value: props?.tile?.content?.summary ?? "",
    isValid: true,
  },
  preview: {
    value: props?.tile?.content?.preview ?? "",
    isValid: true,
  },
  keywords: {
    value: props?.tile?.content?.keywords ?? [],
    isValid: true,
  },
  thumbnail: {
    value: props?.tile?.content?.thumbnail ?? "",
    isValid: true,
  },
};

const emit = defineEmits(["submit", "delete"]);

function validateForm() {
  formIsValid = true;
  for (const field in formData) {
    if (!formData[field as keyof FormData].isValid) {
      formIsValid = false;
      break;
    }
  }
}

function getFormData() {
  tile.title = formData.title.value;
  let contentForm = {} as Article;
  for (const field in formData) {
    contentForm[field as keyof Article] =
      formData[field as keyof FormData].value;
  }
  tile.content = contentForm;
}

function onSubmit() {
  validateForm();
  if (!formIsValid) {
    return;
  }
  getFormData();
  emit("submit", tile);
}

function onDelete() {
  emit("delete", tile.id);
}
</script>

<style lang="scss" scoped></style>
