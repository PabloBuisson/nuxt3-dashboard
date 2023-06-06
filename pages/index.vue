<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pr-4 pl-8">
    <section class="col-span-2">
      <h1 class="text-3xl text-purple-200 mb-4">{{ today }}</h1>
      <div class="flex flex-wrap gap-8 items-start mb-8">
        <TileSummary class="min-w-[12rem] max-w-xl basis-1/3 grow" />
        <TileUpcomingEvents class="min-w-[14rem] max-w-xl basis-1/3 grow" />
      </div>
      <div class="flex justify-center lg:hidden mb-8">
        <DashboardSidebar />
      </div>
      <DashboardGrid />
    </section>
    <section class="hidden lg:flex grow min-w-[18rem] mt-[80px] col-span-1 justify-end">
      <DashboardSidebar />
    </section>
  </div>
</template>

<script setup lang="ts">
import TileUpcomingEvents from "~~/components/Tile/TileUpcomingEvents.vue";
import { useForecastStore } from "~~/stores/forecast-store";
import { useTilesStore } from "~~/stores/tiles-store";

definePageMeta({ title: "My Dashboard", layout: "default" });

const tilesStore = useTilesStore();
const forecastStore = useForecastStore();
const route = useRoute();
const router = useRouter();
const forceRefresh = route.query.forcerefresh == "true";
const today = useDateFormat(useNow(), "dddd DD MMMM", {
  locales: "en-US",
}).value;

try {
  await tilesStore.loadTiles({ forceRefresh });
  if (forceRefresh) {
    forecastStore.tryFetchCity();
  }
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
