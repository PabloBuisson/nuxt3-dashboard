<template>
  <div
    class="relative inline-block w-full max-w-xl h-max bg-purple-800 rounded px-4 pb-6 pt-4"
  >
    <div class="mt-[80px]" v-if="selectedCity && tileWeather">
      <Icon
        size="200"
        class="absolute top-[-100px] left-0 right-0 mx-auto text-orange-200"
        :name="useWeatherIcon(selectedCity.current_weather.weathercode)"
      />
      <div class="flex items-center justify-center flex-wrap gap-2 mb-4">
        <h2 class="text-2xl text-purple-200 font-bold inline-block mr-4">
          {{ selectedCity.current_weather.temperature }} °C
        </h2>
        <NuxtLink class="text-orange-200" :to="'/tile/' + tileWeather.id"
          >Modify</NuxtLink
        >
      </div>
      <div class="text-center">
        <p class="text-purple-100 font-light">
          {{ useWeatherLabel(selectedCity.current_weather.weathercode) }}
        </p>
        <p class="text-purple-200 font-semibold">
          {{ selectedCity.name }}, {{ selectedCity.country_code }}
        </p>
      </div>
      <div class="mt-8 mb-8" v-if="selectedCity.daily?.time?.length > 0">
        <div class="flex justify-between gap-2">
          <h3 class="text-purple-200 font-semibold text-lg mb-2">
            Week's forecast
          </h3>
          <NuxtLink class="text-orange-200" :to="tileForecastLink"
            >see all</NuxtLink
          >
        </div>
        <ForecastWeekSummary
          class="text-purple-100"
          :count="3"
          :daily="selectedCity.daily"
        />
      </div>
    </div>
    <template v-if="tilesEvent && tilesEvent.length > 0">
      <div
        class="[&:not(:last-child)]:mb-8"
        v-for="tileEvent in tilesEvent"
        :key="tileEvent.id"
      >
        <div class="flex items-center flex-wrap gap-4 mt-4 mb-2">
          <h3 class="text-purple-200 font-semibold text-lg">
            {{ tileEvent.title }}
          </h3>
          <NuxtLink class="text-orange-200" :to="'/tile/' + tileEvent.id"
            >Modify</NuxtLink
          >
        </div>
        <ul v-if="tileEvent.content?.length > 0">
          <li
            v-for="(event, index) in tileEvent.content"
            class="relative flex items-center gap-4 justify-between pl-4 text-purple-100 mb-1 before:content[''] before:top-0 before:left-0 before:right-0 before:absolute before:h-full before:w-1 before:rounded"
            :class="getColorBorder(index)"
            :key="event"
          >
            <span>
              {{ event.key }}
            </span>
            <span class="text-sm">
              {{ useDateLabel(event.value) }}
            </span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Tile, TileCategory } from "~~/models/tile";
import { useForecastStore } from "~~/stores/forecast-store";
import { useTilesStore } from "~~/stores/tiles-store";

const tileStore = useTilesStore();
const forecastStore = useForecastStore();

const tileWeather = computed(
  () =>
    tileStore.tiles.filter((tile) => tile.category === TileCategory.WEATHER)[0]
);

if (tileWeather?.value) {
  if (forecastStore.selectedCity == null || forecastStore.shouldUpdate) {
    forecastStore.selectCity(tileWeather.value.content);
  }
}

const selectedCity = computed(() => forecastStore.selectedCity);

const tilesEvent = computed(() => {
  const eventTiles = tileStore.tiles.filter(
    (tile) => tile.category === TileCategory.EVENT
  );

  const futureEventTiles: Tile[] = [];

  if (eventTiles && eventTiles.length > 0) {
    for (const tile of eventTiles) {
      const eventsToDisplay = [];
      if (tile.content && tile.content.length > 0) {
        for (const event of tile.content) {
          // only keep future dates and today dates
          if (
            useDateStringToDate(event.value).getTime() > new Date().getTime() ||
            useDateStringToDate(event.value).toDateString() ===
              new Date().toDateString()
          ) {
            eventsToDisplay.push(event);
          }
        }
      }
      futureEventTiles.push({
        ...tile,
        content: eventsToDisplay,
      });
    }
  }

  return futureEventTiles;
});

const tileForecastLink = computed(() => {
  if (!tileWeather) return "";
  return "/tile/" + tileWeather.value.id;
});

function getColorBorder(index: number): string {
  switch (index) {
    case 0:
      return "before:bg-purple-600";
    case 1:
      return "before:bg-orange-400";
    case 2:
      return "before:bg-blue-500";
    default:
      return "before:bg-purple-600";
  }
}
</script>
