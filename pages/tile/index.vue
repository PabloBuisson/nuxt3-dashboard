<template>
  <div>
    <h1>My tiles</h1>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ title: "My tiles", middleware: ["auth"] });
</script>

<style lang="scss" scoped></style>
