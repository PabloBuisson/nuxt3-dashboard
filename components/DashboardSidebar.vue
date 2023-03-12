<template>
  <div class="inline-block bg-slate-400 p-4">
    <div v-if="selectedCity">
      <h2 class="text-2xl inline-block mr-4">
        {{ selectedCity.current_weather.temperature }} C°
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
    <div v-if="tilesEvent">
      <h2 class="text-2xl">Events</h2>
      <div class="bg-white shadow rounded border inline-block p-4">
        <ul v-for="tile in tilesEvent" :key="tile.id">
          <li v-for="content in tile.content" :key="content">
            {{ content.key }} {{ content.value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TileCategory } from "~~/models/tile";
import { useForecastStore } from "~~/stores/forecast-store";
import { useTilesStore } from "~~/stores/tiles-store";

const tileStore = useTilesStore();
const forecastStore = useForecastStore();
const tilesEvent = computed(() =>
  tileStore.tiles.filter((tile) => tile.category === TileCategory.EVENT)
);
const tileWeather = computed(
  () =>
    tileStore.tiles.filter((tile) => tile.category === TileCategory.WEATHER)[0]
);

if (tileWeather) {
  if (forecastStore.selectedCity == null || forecastStore.shouldUpdate) {
    forecastStore.selectCity(tileWeather.value.content);
  }
}

const selectedCity = computed(() => forecastStore.selectedCity);
</script>
