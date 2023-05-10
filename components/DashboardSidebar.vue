<template>
  <div class="inline-block bg-white bg-opacity-5 p-4">
    <div v-if="selectedCity">
      <Icon
        size="150"
        :name="useWeatherIcon(selectedCity.current_weather.weathercode)"
      />
      <h2 class="text-2xl inline-block mr-4">
        {{ selectedCity.current_weather.temperature }} °C
      </h2>
      <NuxtLink :to="'/tile/' + tileWeather.id">Modify</NuxtLink>
      <div class="bg-white shadow rounded border block p-4">
        <p>
          {{ useWeatherLabel(selectedCity.current_weather.weathercode) }}
        </p>
        <p>{{ selectedCity.name }}, {{ selectedCity.country_code }}</p>
      </div>
      <div v-if="selectedCity.daily?.time?.length > 0">
        <h3>Week's forecast</h3>
        <ForecastWeekSummary :daily="selectedCity.daily" />
      </div>
    </div>
    <template v-if="tilesEvent && tilesEvent.length > 0">
      <div v-for="tileEvent in tilesEvent" :key="tileEvent.id">
        <h2 class="text-2xl inline-block">{{ tileEvent.title }}</h2>
        <NuxtLink :to="'/tile/' + tileEvent.id">Modify</NuxtLink>
        <div
          v-if="tileEvent.content?.length > 0"
          class="bg-white shadow rounded border inline-block p-4"
        >
          <ul>
            <li v-for="event in tileEvent.content" :key="event">
              {{ event.key }} {{ useDateLabel(event.value) }}
            </li>
          </ul>
        </div>
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
    const eventsToDisplay = [];

    for (const tile of eventTiles) {
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
        futureEventTiles.push({
          ...tile,
          content: eventsToDisplay,
        });
      }
    }
  }

  return futureEventTiles;
});
</script>
