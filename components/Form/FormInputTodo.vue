<template>
  <div>
    <div v-once class="input-control">
      <label :for="idCheckbox">
        <input
          :id="idInput"
          type="text"
          v-bind="$attrs"
          :value="modelValue.input.value"
          @paste="onPaste($event)"
          @input="onFieldUpdate($event, 'text')"
          @focusin="clearValidity()"
          @focusout="checkValidity($event)"
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
let isValid = ref(true);

const emit = defineEmits(["update:modelValue", "deleteTodo"]);

function clearValidity() {
  errorMessages = [];
  isValid.value = true;
}

function clearValidtyWithoutChecking() {
  if (errorMessages?.length > 0) {
    errorMessages = [];
  }
  if (!isValid.value) {
    isValid.value = true;
  }
}

function checkValidity(event: Event) {
  const eventValue = (event.target as HTMLInputElement).value;

  if (eventValue === "") {
    errorMessages = [errorMessageByValidatorName["required"]];
    isValid.value = false;
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
      isValid.value = false;
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
      input: { value: eventValue, isValid: isValid.value },
    } as { id: string; input: ModelValue; checkbox: ModelValue };
  } else if (type === "checkbox") {
    const inputValue = (
      document.getElementById(props.idInput) as HTMLInputElement
    )?.value;
    modelValueUpdated = {
      id: props.modelValue.id,
      input: { value: inputValue, isValid: isValid.value },
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
