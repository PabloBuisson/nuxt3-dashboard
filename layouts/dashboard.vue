<template>
    <div>
        <NuxtLayout name="default">
            <div class="flex justify-between">
                <slot />
                <DashboardSidebar />
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

</script>