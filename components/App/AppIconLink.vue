<template>
  <NuxtLink
    class="inline-flex items-center justify-center rounded bg-orange-400 p-[0.375rem] text-orange-200"
    :to="link"
  >
    <Icon :size="iconSize" class="text-orange-900" :name="iconName" />
    <span class="sr-only">{{ linkLabel }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  link: string;
  linkLabel: string;
  iconName: string;
  iconSize: string;
}

const props = defineProps<Props>();
</script>
