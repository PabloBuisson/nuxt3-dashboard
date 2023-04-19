<template>
  <div>
    <div v-once class="input-control">
      <label :for="idCheckbox">
        <input
          :id="idInput"
          type="text"
          v-bind="$attrs"
          :value="modelValue.input.value"
          @paste="onFieldUpdate($event, 'text')"
          @input="onFieldUpdate($event, 'text')"
          @focusin="clearValidity()"
        />
      </label>
      <input
        :id="idCheckbox"
        type="checkbox"
        :value="modelValue.checkbox.value"
        :checked="modelValue.checkbox.value"
        v-bind="$attrs"
        @input="onFieldUpdate($event, 'checkbox')"
      />
      <button
        class="px-4 py-2 font-semibold bg-red-700 text-white rounded shadow-sm"
        @click="deleteTodo()"
        type="button"
      >
        Delete
      </button>
    </div>
    <div v-if="!isValid">
      <p v-for="message of errorMessages">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModelValue } from "~~/models/model-value";

interface Props {
  idTodo: string;
  idCheckbox: string;
  idInput: string;
  modelValue: { id: string; input: ModelValue; checkbox: ModelValue };
}

const props = withDefaults(defineProps<Props>(), {
  idCheckbox: `checkbox-${new Date().getTime()}`,
  idInput: `input-${new Date().getTime()}`,
});

let errorMessages: string[] = [];
let isValid = ref(true);

const emit = defineEmits(["update:modelValue", "deleteTodo"]);

function clearValidity() {
  errorMessages = [];
  isValid.value = true;
}

function onFieldUpdate(event: Event, type: string) {
  let eventValue;
  let modelValueUpdated;
  if (type === "text") {
    eventValue = (event.target as HTMLInputElement).value;
  } else if (type === "checkbox") {
    eventValue = (event.target as HTMLInputElement).checked;
  }

  if (type === "text" && eventValue === "") {
    errorMessages.push("This field is required");
    console.log("error in the form");
    isValid.value = false;
  }

  if (type === "text") {
    modelValueUpdated = {
      ...props.modelValue,
      input: { value: eventValue, isValid: isValid.value },
    } as { id: string; input: ModelValue; checkbox: ModelValue };
  } else if (type === "checkbox") {
    modelValueUpdated = {
      ...props.modelValue,
      checkbox: { value: eventValue, isValid: isValid.value },
    } as { id: string; input: ModelValue; checkbox: ModelValue };
  }

  console.log("FormInputTodo l.84", modelValueUpdated);

  emit("update:modelValue", { ...modelValueUpdated });
}

function deleteTodo() {
  emit("deleteTodo", props.idTodo);
}
</script>
