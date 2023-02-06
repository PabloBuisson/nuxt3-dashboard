<template>
  <div class="input-control">
    <label :for="id"><slot></slot></label>
    <input
      v-if="controlType === 'input'"
      :id="id"
      v-bind="$attrs"
      :value="modelValue"
      @input="onFieldUpdate($event)"
    />
    <textarea
      v-if="controlType === 'textarea'"
      rows="10"
      :id="id"
      :value="modelValue"
      @input="onFieldUpdate($event)"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  controlType?: string;
  modelValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  id: `${new Date().getTime()}`,
  controlType: "input",
  modelValue: "",
});
const emit = defineEmits(["update:modelValue"]);

function onFieldUpdate(event: Event) {
  const eventValue = (event.target as HTMLInputElement).value;
  console.log(eventValue);
  emit('update:modelValue', eventValue);
}
</script>
