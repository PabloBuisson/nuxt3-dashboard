<template>
  <div class="input-control">
    <label :for="id"><slot></slot></label>
    <input
      v-if="controlType === 'input'"
      :id="id"
      :type="type"
      v-bind="$attrs"
      :value="modelValue.value"
      @input="onFieldUpdate($event)"
      @focusin="clearValidity()"
    />
    <textarea
      v-if="controlType === 'textarea'"
      rows="10"
      :id="id"
      :value="modelValue.value"
      @input="onFieldUpdate($event)"
      @focusin="clearValidity()"
    ></textarea>
    <div v-if="!isValid">
      <p v-for="message of errorMessages">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  type?: string;
  controlType?: string;
  modelValue: ModelValue;
}

const props = withDefaults(defineProps<Props>(), {
  id: `${new Date().getTime()}`,
  controlType: "input",
});
let errorMessages: string[] = [];
let isValid = ref(true);

const emit = defineEmits(["update:modelValue"]);

function clearValidity() {
  errorMessages = [];
  isValid.value = true;
}

function onFieldUpdate(event: Event) {
  const eventValue = (event.target as HTMLInputElement).value;

  if (props.modelValue.validators?.includes("required")) {
    if (eventValue === "") {
      errorMessages.push("This field is required");
      console.log("error in the form");
      isValid.value = false;
    }
  }

  emit("update:modelValue", { value: eventValue, isValid: isValid.value });
}
</script>
