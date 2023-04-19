<template>
  <div>
    <div v-once class="input-control">
      <label :for="id"><slot></slot></label>
      <input
        v-if="controlType === 'input'"
        :id="id"
        :type="type"
        v-bind="$attrs"
        :checked="type === 'checkbox' ? modelValue.value : undefined"
        :value="modelValue.value"
        @paste="onPaste($event)"
        @input="onFieldUpdate($event)"
        @focusin="clearValidity()"
        @focusout="checkValidity($event)"
      />
      <textarea
        v-if="controlType === 'textarea'"
        rows="10"
        :id="id"
        :value="modelValue.value"
        @paste="onPaste($event)"
        @input="onFieldUpdate($event)"
        @focusin="clearValidity()"
        @focusout="checkValidity($event)"
      ></textarea>
    </div>
    <div v-if="!isValid">
      <p v-for="message of errorMessages">{{ message }}</p>
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
