<template>
  <div>
    <div class="flex justify-start flex-wrap items-center w-full gap-3">
      <div class="flex items-start gap-2 grow">
        <input
          :id="idCheckbox"
          type="checkbox"
          class="w-6 h-6 shrink-0 mt-3 accent-purple-500"
          :value="modelValue.checkbox.value"
          :checked="modelValue.checkbox.value"
          v-bind="$attrs"
          @input="onFieldUpdate($event, 'checkbox')"
        />
        <div class="flex flex-col">
          <label :for="idCheckbox" class="basis-1/2 grow min-w-[10rem] mx-auto">
            <input
              v-once
              :id="idInput"
              type="text"
              v-bind="$attrs"
              class="bg-purple-900 w-full border border-purple-900 text-purple-100 rounded focus-visible:outline-none focus:ring-purple-700 focus:border-purple-700 invalid:border-red-400 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
              :value="modelValue.input.value"
              required
              @paste="onPaste($event)"
              @input="onFieldUpdate($event, 'text')"
              @focusin="clearValidity()"
              @focusout="checkValidity($event)"
            />
          </label>
          <div
            v-if="!isFieldValid"
            class="mt-1 min-h-[2.5rem] bg-red-300 rounded p-2.5"
          >
            <p class="text-red-900 text-sm" v-for="message of errorMessages">
              {{ message }}
            </p>
          </div>
        </div>
      </div>
      <button
        class="grow-0 ml-8 px-6 py-2 font-semibold text-sm bg-black bg-opacity-20 text-red-400 rounded"
        @click="deleteTodo()"
        type="button"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModelValue, errorMessageByValidatorName } from "~~/models/model-value";

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
let isFieldValid = ref(true);

const emit = defineEmits(["update:modelValue", "deleteTodo"]);

function clearValidity() {
  errorMessages = [];
  isFieldValid.value = true;
}

function clearValidtyWithoutChecking() {
  if (errorMessages?.length > 0) {
    errorMessages = [];
  }
  if (!isFieldValid.value) {
    isFieldValid.value = true;
  }
}

function checkValidity(event: Event) {
  const eventValue = (event.target as HTMLInputElement).value;

  if (eventValue === "") {
    errorMessages = [errorMessageByValidatorName["required"]];
    isFieldValid.value = false;
  }
}

function onPaste(event: ClipboardEvent) {
  const eventValue = event.clipboardData?.getData("text/plain");
  checkValidators("text", eventValue);
  updateModelValue("text", eventValue);
}

function onFieldUpdate(event: Event, type: "text" | "checkbox") {
  let eventValue: string | boolean = (event.target as HTMLInputElement).value;
  if (type === "checkbox") {
    eventValue = (event.target as HTMLInputElement).checked;
  }

  checkValidators(type, eventValue);
  updateModelValue(type, eventValue);
}

function checkValidators(
  type: "text" | "checkbox",
  eventValue: string | boolean | undefined
) {
  if (type === "text") {
    if (eventValue === "") {
      errorMessages = [errorMessageByValidatorName["required"]];
      console.log("error in the form");
      isFieldValid.value = false;
    } else {
      clearValidtyWithoutChecking();
    }
  }
}

function updateModelValue(
  type: "text" | "checkbox",
  eventValue: string | boolean | undefined
) {
  let modelValueUpdated;
  if (type === "text") {
    const checkboxValue = (
      document.getElementById(props.idCheckbox) as HTMLInputElement
    )?.checked;
    modelValueUpdated = {
      id: props.modelValue.id,
      checkbox: { value: checkboxValue, isValid: true },
      input: { value: eventValue, isValid: isFieldValid.value },
    } as { id: string; input: ModelValue; checkbox: ModelValue };
  } else if (type === "checkbox") {
    const inputValue = (
      document.getElementById(props.idInput) as HTMLInputElement
    )?.value;
    modelValueUpdated = {
      id: props.modelValue.id,
      input: { value: inputValue, isValid: isFieldValid.value },
      checkbox: { value: eventValue, isValid: true },
    } as { id: string; input: ModelValue; checkbox: ModelValue };
  }

  console.log("FormInputTodo l.84", modelValueUpdated);

  emit("update:modelValue", { ...modelValueUpdated });
}

function deleteTodo() {
  emit("deleteTodo", props.idTodo);
}
</script>
