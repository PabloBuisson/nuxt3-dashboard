<template>
    <div>
        <h1>Tile details</h1>
        <p>{{ route.params.tileId }}</p>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router' // workaround bug #6646

const route = useRoute();

// get infos of tile in Firebase
// display infos
</script>

<style lang="scss" scoped>

</style>