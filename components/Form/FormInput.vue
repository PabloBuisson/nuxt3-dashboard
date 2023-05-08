<template>
  <div>
    <div
      v-once
      class="flex"
      :class="{
        'flex-col': type !== 'checkbox',
        'items-center gap-4': type === 'checkbox',
      }"
    >
      <label :for="id" class="text-purple-100 font-semibold block mb-2"
        ><slot></slot
      ></label>
      <input
        v-if="controlType === 'input'"
        class="bg-purple-100 border border-purple-300 text-purple-900 rounded focus:ring-purple-500 focus:border-purple-500 invalid:border-red-400 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
        :class="{
          'w-full': type !== 'checkbox',
          'mb-2 w-4 h-4 accent-purple-500': type === 'checkbox',
        }"
        :id="id"
        :type="type"
        v-bind="$attrs"
        :checked="type === 'checkbox' ? modelValue.value : undefined"
        :value="modelValue.value"
        :required="isRequired"
        @paste="onPaste($event)"
        @input="onFieldUpdate($event)"
        @focusin="clearValidity()"
        @focusout="checkValidity($event)"
      />
      <textarea
        v-if="controlType === 'textarea'"
        class="bg-purple-100 border border-purple-300 text-purple-900 rounded focus:ring-purple-500 focus:border-purple-500 invalid:border-red-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
        rows="2"
        :id="id"
        :value="modelValue.value"
        :required="isRequired"
        @paste="onPaste($event)"
        @input="onFieldUpdate($event)"
        @focusin="clearValidity()"
        @focusout="checkValidity($event)"
      ></textarea>
    </div>
    <div
      class="mt-1 min-h-[2.5rem] bg-red-300 rounded p-2.5"
      :class="{ invisible: isValid, visible: !isValid }"
    >
      <p class="text-red-900 text-sm" v-for="message of errorMessages">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModelValue, errorMessageByValidatorName } from "~~/models/model-value";

interface Props {
  id: string;
  type?: string;
  controlType?: string;
  modelValue: ModelValue;
}

const props = withDefaults(defineProps<Props>(), {
  id: `${new Date().getTime()}`,
  controlType: "input",
  type: "text",
});

let errorMessages: string[] = [];
let isValid = ref(true);
const isRequired = computed(() => props.modelValue.validators?.includes("required"));

const emit = defineEmits(["update:modelValue"]);

function clearValidity() {
  errorMessages = [];
  isValid.value = true;
}

function checkValidity(event: Event) {
  const eventValue = getEventValue(event);

  if (props.modelValue.validators?.includes("required") && eventValue === "") {
    errorMessages = [errorMessageByValidatorName["required"]];
    isValid.value = false;
  }
}

function clearValidtyWithoutChecking() {
  if (errorMessages?.length > 0) {
    errorMessages = [];
  }
  if (!isValid.value) {
    isValid.value = true;
  }
}

function onPaste(event: ClipboardEvent) {
  const eventValue = event.clipboardData?.getData("text/plain");
  if (eventValue) {
    checkValidators(eventValue);
  }

  emit("update:modelValue", { value: eventValue, isValid: isValid.value });
}

function onFieldUpdate(event: Event) {
  const eventValue = getEventValue(event);
  checkValidators(eventValue);

  emit("update:modelValue", { value: eventValue, isValid: isValid.value });
}

function checkValidators(eventValue: string | boolean) {
  if (props.modelValue.validators?.includes("required")) {
    if (eventValue === "") {
      errorMessages = [errorMessageByValidatorName["required"]];
      isValid.value = false;
    } else {
      clearValidtyWithoutChecking();
    }
  }
}

function getEventValue(event: Event): string | boolean {
  if (props.controlType === "input") {
    if (props.type === "checkbox") {
      return (event.target as HTMLInputElement).checked;
    } else {
      return (event.target as HTMLInputElement).value;
    }
  } else {
    return (event.target as HTMLTextAreaElement).value;
  }
}
</script>
