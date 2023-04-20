<template>
  <div>
    <h1>Todos Tile</h1>
    <form @submit.prevent="onSubmit">
      <FormInput id="todos-title" v-model="formData.title">Title</FormInput>
      <div v-for="(todo, index) in content">
        <FormInputTodo
          v-model="formData.todos.value[index]"
          :id-todo="todo.id"
          :id-input="'input-todo' + todo.id"
          :id-checkbox="'checkbox-todo' + todo.id"
          @delete-todo="deleteTodo(index)"
        />
        <!-- <label :for="todo.id">
          <input v-model="todo.key" />
        </label>
        <input
          :id="todo.id"
          type="checkbox"
          :value="todo.id"
          v-model="todo.value"
        />
        <button v-if="index > 0" @click="deleteTodo(index)" type="button">
          Delete
        </button> -->
      </div>
      <button
        class="px-4 py-2 font-semibold bg-green-700 text-white rounded shadow-sm"
        @click="addTodo"
        type="button"
      >
        Add todo
      </button>
      <FormInput id="post-pin" type="checkbox" v-model="formData.isPinned"
        >Pin this post in dashboard ?</FormInput
      >
      <button
        v-if="isWriteRequestAllowed"
        class="px-4 py-2 font-semibold bg-cyan-500 text-white rounded shadow-sm"
        type="submit"
      >
        Update
      </button>
      <button
        class="px-4 py-2 font-semibold bg-red-700 text-white rounded shadow-sm"
        v-if="isEditPage && isWriteRequestAllowed"
        @click="onDelete"
        type="button"
      >
        Delete
      </button>
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

type FormData = {
  [propName in keyof Todos]: ModelValue;
};

interface Todos {
  title: string;
  todos: any;
  isPinned: boolean;
}

interface Todo {
  key: string;
  value: boolean;
  id: string;
}

interface TodoModelValue {
  id: string;
  input: ModelValue;
  checkbox: ModelValue;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

const isWriteRequestAllowed = computed(() => authStore.isAuthenticated);
const isEditPage = computed(() => tile.id !== "");
let formIsValid = true;
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.TODOS,
  content: "",
  dateCreation: new Date(),
};

const content = props.tile
  ? ref(props.tile.content as Todo[])
  : ref([
      {
        key: "Todo1",
        value: false,
        id: "1",
      },
    ]);

const todosModelValue: TodoModelValue[] = [];
initTodoForm();

function initTodoForm() {
  for (const todo of content.value) {
    const todoSaved: Todo = todo;
    const todoModelValue: TodoModelValue = {
      id: todoSaved.id,
      input: {
        value: todoSaved.key,
        isValid: true,
        validators: ["required"],
      },
      checkbox: {
        value: todoSaved.value,
        isValid: true,
      },
    };
    todosModelValue.push(todoModelValue);
  }
}

const formData: FormData = {
  title: {
    value: props?.tile?.title ?? "",
    isValid: true,
    validators: ["required"],
  },
  todos: {
    value: todosModelValue,
    isValid: true,
  },
  isPinned: {
    value: props?.tile?.isPinned ?? false,
    isValid: true,
  },
};

console.log("TileFormTodos l.111", [
  content.value,
  todosModelValue,
  formData.todos,
]);

const emit = defineEmits(["submit", "delete", "error"]);

function addTodo() {
  const todosLength = content.value.length;
  const lastTodoId = content.value[todosLength - 1].id;
  const newTodo: Todo = {
    key: `Todo${+lastTodoId + 1}`,
    value: false,
    id: `${+lastTodoId + 1}`,
  };
  content.value.push(newTodo);
  addTodoToModelValue(newTodo);
}

function addTodoToModelValue(todo: Todo) {
  const todoModelValue: TodoModelValue = {
    id: todo.id,
    input: {
      value: todo.key,
      isValid: true,
      validators: ["required"],
    },
    checkbox: {
      value: todo.value,
      isValid: true,
    },
  };
  formData.todos.value.push(todoModelValue);
}

function deleteTodo(index: number) {
  const todoToDelete = content.value[index];
  formData.todos.value = formData.todos.value.filter(
    (todo: TodoModelValue) => todo.id != todoToDelete.id
  );
  content.value = content.value.filter(
    (todo: Todo) => todo.id !== todoToDelete.id
  );
}

function validateForm() {
  formIsValid = true;
  for (const todo of formData.todos.value as TodoModelValue[]) {
    if (!todo.input.isValid) {
      formIsValid = false;
      return;
    }
  }

  for (const field in formData) {
    if (!formData[field as keyof FormData].isValid) {
      formIsValid = false;
      break;
    }
  }
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

  const todosToSave = [];
  for (const todo of formData.todos.value as TodoModelValue[]) {
    const todoToSave: Todo = {
      id: todo.id,
      key: todo.input.value,
      value: todo.checkbox.value,
    };
    todosToSave.push(todoToSave);
  }
  tile.title = formData.title.value;
  tile.isPinned = formData.isPinned.value;
  tile.content = todosToSave;

  emit("submit", tile);
}

function onDelete() {
  if (!isWriteRequestAllowed) return;
  emit("delete", tile.id);
}
</script>

<style lang="scss" scoped></style>
