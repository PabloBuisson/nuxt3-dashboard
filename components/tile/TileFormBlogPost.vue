<template>
  <div class="max-w-4xl">
    <h1
      class="text-xl bg-purple-300 text-purple-900 py-2 px-3 rounded w-max mb-8"
    >
      Blog Post Tile
    </h1>
    <form @submit.prevent="onSubmit">
      <FormInput id="post-title" v-model="formData.title">Title</FormInput>
      <FormInput id="post-subtitle" v-model="formData.subtitle"
        >Subtitle</FormInput
      >
      <FormInput id="post-author" v-model="formData.author"
        >Author Name</FormInput
      >
      <FormInput id="post-thumbnail" v-model="formData.thumbnail"
        >Thumbnail Link</FormInput
      >
      <FormInput
        id="post-content"
        control-type="textarea"
        v-model="formData.content"
        >Content</FormInput
      >
      <FormInput
        id="post-preview"
        control-type="textarea"
        v-model="formData.preview"
        >Preview Text</FormInput
      >
      <FormInput id="post-pin" type="checkbox" v-model="formData.isPinned"
        >Pin this post in dashboard ?</FormInput
      >
      <div class="flex flex-col items-center mt-4 gap-16">
        <button
          v-if="isWriteRequestAllowed"
          class="w-full max-w-xs px-6 py-2 font-semibold text-lg bg-orange-300 text-orange-900 rounded shadow-sm"
          type="submit"
        >
          Update
        </button>
        <button
          class="w-full max-w-xs px-6 py-2 font-semibold text-lg bg-red-300 text-red-900 rounded shadow-sm"
          v-if="isEditPage && isWriteRequestAllowed"
          @click="onDelete"
          type="button"
        >
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ModelValue } from "~~/models/model-value";
import { Tile, TileCategory } from "~~/models/tile";
import { useAuthStore } from "~~/stores/auth-store";

interface Props {
  tile?: Tile;
}

type TileFormData = {
  [propName in keyof Article]: ModelValue;
};

interface Article {
  title: string;
  subtitle: string;
  author: string;
  content: string;
  preview: string;
  keywords: string[];
  thumbnail: string;
  isPinned: boolean;
}

const props = defineProps<Props>();
const authStore = useAuthStore();
const isWriteRequestAllowed = computed(() => authStore.isAuthenticated);
let formIsValid = true;
const emit = defineEmits(["submit", "delete", "error"]);
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.POST,
  content: {},
  dateCreation: new Date(),
};
const isEditPage = computed(() => tile.id !== "");
const formData: TileFormData = {
  title: {
    value: props?.tile?.title ?? "",
    isValid: true,
    validators: ["required"],
  },
  subtitle: {
    value: props?.tile?.content?.subtitle ?? "",
    isValid: true,
  },
  author: {
    value: props?.tile?.content?.author ?? "",
    isValid: true,
  },
  content: {
    value: props?.tile?.content?.content ?? "",
    isValid: true,
    validators: ["required"],
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
  isPinned: {
    value: props?.tile?.isPinned ?? false,
    isValid: true,
  },
};

function validateForm() {
  formIsValid = true;
  for (const field in formData) {
    if (!formData[field as keyof TileFormData].isValid) {
      formIsValid = false;
      break;
    }
  }
}

function getFormData() {
  tile.title = formData.title.value;
  tile.isPinned = formData.isPinned.value;
  let contentForm = {} as Article;
  for (const field in formData) {
    if (field != "title" && field != "isPinned") {
      (contentForm[field as keyof Article] as any) =
        formData[field as keyof TileFormData].value;
    }
  }
  tile.content = contentForm;
}

function onSubmit() {
  validateForm();
  if (!formIsValid || !isWriteRequestAllowed) {
    emit(
      "error",
      "Oops form is invalid ! Please check all the fields and try again"
    );
    return;
  }
  getFormData();
  emit("submit", tile);
}

function onDelete() {
  if (!isWriteRequestAllowed) return;
  emit("delete", tile.id);
}
</script>

<style lang="scss" scoped></style>
