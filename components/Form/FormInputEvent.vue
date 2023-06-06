<template>
  <div>
    <div v-once class="flex justify-end flex-wrap items-center w-full gap-4">
      <label :for="idInput" class="basis-1/3 grow min-w-[12rem]">
        <input
          :id="idLabel"
          type="text"
          v-bind="$attrs"
          :value="modelValue.label.value"
          class="bg-purple-100 w-full border border-purple-300 font-semibold text-purple-900 rounded focus:ring-purple-500 focus:border-purple-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
          @paste="onPaste($event)"
          @input="onFieldUpdate($event, 'label')"
          @focusin="clearValidity('label')"
          @focusout="checkValidity($event, 'label')"
        />
      </label>
      <input
        :id="idInput"
        type="text"
        placeholder="DD/MM/YYYY"
        maxlength="10"
        class="w-full min-w-[12rem] basis-1/3 grow bg-purple-100 border border-purple-300 text-purple-900 rounded focus:ring-purple-500 focus:border-purple-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
        v-date
        @paste.prevent
        :value="modelValue.input.value"
        v-bind="$attrs"
        @input="onFieldUpdate($event, 'input')"
        @focusin="clearValidity('input')"
        @focusout="checkValidity($event, 'input')"
      />
      <button
        class="grow-0 px-6 py-2 font-semibold text-sm bg-black bg-opacity-20 text-red-400 rounded"
        @click="deleteEvent()"
        type="button"
      >
        Delete
      </button>
    </div>
    <div
      v-if="!isLabelValid || !isInputValid"
      class="mt-1 min-h-[1.875rem] bg-red-300 rounded px-1.5 py-1"
    >
      <p
        class="text-red-900 flex items-center gap-2 text-sm"
        v-for="message of errorMessages"
      >
        <Icon size="20" name="fluent:warning-24-regular" />{{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "@vue/runtime-dom";
import { ModelValue } from "~~/models/model-value";

interface Props {
  idEvent: string;
  idLabel: string;
  idInput: string;
  modelValue: { id: string; label: ModelValue; input: ModelValue };
}

const props = withDefaults(defineProps<Props>(), {
  idLabel: `label-${new Date().getTime()}`,
  idInput: `input-${new Date().getTime()}`,
});

const vDate = {
  mounted: (element: HTMLInputElement) => {
    element.addEventListener("keypress", function (event) {
      // prevent non-numeric value
      // key should be "1", "2, "3", ect.
      if (event.key != "/" && isNaN(+event.key)) {
        event.preventDefault();
      }

      const inputLength: number = element.value.length;

      // If we're at a particular place, let the user type the slash
      // i.e., 12/12/1212
      if (inputLength !== 1 || inputLength !== 3) {
        if (event.key == "/") {
          event.preventDefault();
        }
      }

      // If they don't add the slash, do it for them...
      if (inputLength === 2) {
        if (+element.value > 31) {
          element.value = "31";
        }
        element.value += "/";
      }

      // If they don't add the slash, do it for them...
      if (inputLength === 5) {
        if (+element.value.substring(3, 5) > 12) {
          element.value = element.value.substring(0, 3) + "12";
        }
        element.value += "/";
      }
    });
  },
};

let errorMessages: Ref<string[]> = ref([]);
const errorRequiredMessageMap: Record<"label" | "input", string> = {
  label: "Please enter the name of the event",
  input: "Please enter the date of the event",
};
const isLabelValid = ref(true);
const isInputValid = ref(true);

const emit = defineEmits(["update:modelValue", "deleteEvent"]);

function clearValidity(role: "label" | "input") {
  errorMessages.value = errorMessages.value.filter(
    (message) => message !== errorRequiredMessageMap[role]
  );
  setValidity(role, true);
}

function clearValidtyWithoutChecking(role: "label" | "input") {
  errorMessages.value = errorMessages.value.filter(
    (message) => message !== errorRequiredMessageMap[role]
  );
  setValidity(role, true);
}

function setValidity(role: "label" | "input", isValid: boolean) {
  if (role === "label" && isLabelValid.value === !isValid) {
    isLabelValid.value = isValid;
  } else if (role === "input" && isInputValid.value === !isValid) {
    isInputValid.value = isValid;
  }
}

function checkValidity(event: Event, role: "label" | "input") {
  const eventValue = (event.target as HTMLInputElement).value;

  if (eventValue === "") {
    if (
      errorMessages.value.findIndex(
        (message) => message === errorRequiredMessageMap[role]
      ) === -1
    ) {
      errorMessages.value = [
        ...errorMessages.value,
        errorRequiredMessageMap[role],
      ];
    }
    setValidity(role, false);
  }
}

function onPaste(event: ClipboardEvent) {
  const eventValue = event.clipboardData?.getData("text/plain");
  checkValidators("label", eventValue);
  if (eventValue) {
    updateModelValue("label", eventValue);
  }
}

function onFieldUpdate(event: Event, role: "label" | "input") {
  let eventValue: string = (event.target as HTMLInputElement).value;

  checkValidators(role, eventValue);
  updateModelValue(role, eventValue);
}

function checkValidators(
  role: "label" | "input",
  eventValue: string | boolean | undefined
) {
  if (eventValue === "") {
    if (
      errorMessages.value.findIndex(
        (message) => message === errorRequiredMessageMap[role]
      ) === -1
    ) {
      errorMessages.value = [
        ...errorMessages.value,
        errorRequiredMessageMap[role],
      ];
    }
    console.log("error in the form");
    setValidity(role, false);
  } else {
    clearValidtyWithoutChecking(role);
  }
}

function updateModelValue(role: "label" | "input", eventValue: string) {
  let modelValueUpdated;
  if (role === "label") {
    const inputValue = (
      document.getElementById(props.idInput) as HTMLInputElement
    )?.value;
    modelValueUpdated = {
      id: props.modelValue.id,
      label: { value: eventValue, isValid: isLabelValid.value },
      input: { value: inputValue, isValid: isInputValid.value },
    } as { id: string; label: ModelValue; input: ModelValue };
  } else if (role === "input") {
    const labelValue = (
      document.getElementById(props.idLabel) as HTMLInputElement
    )?.value;
    modelValueUpdated = {
      id: props.modelValue.id,
      label: { value: labelValue, isValid: isLabelValid.value },
      input: { value: eventValue, isValid: isInputValid.value },
    } as { id: string; label: ModelValue; input: ModelValue };
  }

  console.log("FormInputTodo l.84", modelValueUpdated);

  emit("update:modelValue", { ...modelValueUpdated });
}

function deleteEvent() {
  emit("deleteEvent", props.idEvent);
}
</script>
