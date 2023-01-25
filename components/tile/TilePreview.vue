<template>
  <NuxtLink :to="tileLink" class="post-preview">
    <div class="bg-white shadow rounded border p-4">
        <h2>{{ title }}</h2>
        <slot />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  id: string
}
const router = useRouter();
const props = withDefaults(defineProps<Props>(), {
  title: 'My title',
})

const tileLink = computed(() => {
  return '/tile/' + props.id
})
</script>