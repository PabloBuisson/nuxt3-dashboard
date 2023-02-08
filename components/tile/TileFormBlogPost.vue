<template>
  <div>
    <h1>Blog Post Tile</h1>
    <form @submit.prevent="onSubmit">
      <AppInput
        :validators="{ required: true }"
        id="post-title"
        v-model="formData.title"
        >Title</AppInput
      >
      <AppInput id="post-subtitle" v-model="formData.subtitle"
        >Subtitle</AppInput
      >
      <AppInput id="post-author" v-model="formData.author"
        >Author Name</AppInput
      >
      <AppInput id="post-thumbnail" v-model="formData.thumbnail"
        >Thumbnail Link</AppInput
      >
      <AppInput
        :validators="{ required: true }"
        id="post-content"
        control-type="textarea"
        v-model="formData.content"
        >Content</AppInput
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

interface ModelValue {
  value: any;
  isValid: boolean;
}

interface FormData {
  title: ModelValue;
  subtitle: ModelValue;
  author: ModelValue;
  preview: ModelValue;
  thumbnail: ModelValue;
  content: ModelValue;
  keywords: ModelValue;
}

interface Article {
  title: string;
  subtitle?: string;
  author?: string;
  content: string;
  preview: string;
  keywords?: string[];
  thumbnail?: string;
}

const props = defineProps<Props>();
let formIsValid = true;
const emit = defineEmits(["submit"]);
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.POST,
  content: {},
  dateCreation: new Date(),
};

const formData: FormData = {
  title: {
    value: props?.tile?.title ?? "",
    isValid: true,
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

// const formValidators = {
//   title: {
//     isValid: true,
//   },
//   subtitle: {
//     isValid: true,
//   },
//   content: {
//     isValid: true,
//   },
//   preview: {
//     isValid: true,
//   },
//   keywords: {
//     isValid: true,
//   },
//   thumbnail: {
//     isValid: true,
//   },
// };

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
</script>

<style lang="scss" scoped></style>
