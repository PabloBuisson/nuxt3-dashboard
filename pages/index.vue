<template>
  <div class="flex flex-wrap justify-between gap-8 pr-4 pl-8">
    <section class="basis-2/4">
      <h1 class="text-3xl text-purple-200 mb-4">{{ today }}</h1>
      <div class="flex flex-wrap gap-8 items-start mb-8">
        <TileSummary class="basis-1/2" />
        <TileUpcomingEvents />
      </div>
      <DashboardGrid />
      <NuxtLink
        class="inline-block mt-8 p-8 border-4 border-dashed border-purple-300 text-purple-300"
        to="tile/new"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <span class="aria-hidden:true text-4xl">+</span>
          <span>Add a tile</span>
        </div>
      </NuxtLink>
    </section>
    <section class="grow min-w-[18rem] mt-[80px]">
      <DashboardSidebar />
    </section>
  </div>
</template>

<script setup lang="ts">
import TileUpcomingEvents from "~~/components/Tile/TileUpcomingEvents.vue";
import { useTilesStore } from "~~/stores/tiles-store";

definePageMeta({ title: "My Dashboard", layout: "default" });

const store = useTilesStore();
const route = useRoute();
const router = useRouter();
const forceRefresh = route.query.forcerefresh == "true";
const today = useDateFormat(useNow(), "dddd DD MMMM", {
  locales: "en-US",
}).value;

try {
  await store.loadTiles({ forceRefresh });
} catch (errorMessage) {
  useAppToaster({ message: `${errorMessage}`, type: "danger" });
}

// Delete query params in url

const emptyQuery = {
  param: [],
};

if (forceRefresh) {
  router.replace({ query: emptyQuery });
}
</script>
