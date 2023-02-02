<template>
  <div>
    <h1>Weather Forecast Tile</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="tile.title" />
      <label for="autocomplete-city">How is the weather in your city ?</label>
      <input type="text" id="autocomplete-city" v-model="searchTerm" />
      <ul v-show="searchCities.length > 0">
        <li
          v-for="city in searchCities"
          :key="city.id"
          @click="selectCity(city)"
        >
          {{ city.name }} ({{ city.country }})
        </li>
      </ul>
      <div v-show="selectedCity">
        <p>
          Selected city : {{ selectedCity?.name }} ({{ selectedCity?.country }})
        </p>
        <p>
          Current temperature : {{ selectedCity?.current_weather?.temperature }}
        </p>
        <p>Current time : {{ selectedCity?.current_weather?.time }}</p>
        <p>Current weather : {{ selectedCity?.current_weather?.weathercode }}</p>
      </div>
      <button
        class="px-4 py-2 font-semibold bg-cyan-500 text-white rounded shadow-sm"
        type="submit"
      >
        Update
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { Tile, TileCategory } from "~~/models/tile";

interface Props {
  tile?: Tile;
}

interface GeocodingGETResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  admin3_id: number;
  admin4_id: number;
  timezone: string;
  population: number;
  postcodes: string[];
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
  admin3: string;
  admin4: string;
}

interface GeocodingGETResponse {
  results: GeocodingGETResult[];
}

interface ForecastGETResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  hourly_units: {
    temperature_2m: string;
  };
  current_weather: {
    time: string;
    temperature: number;
    weathercode: number;
    windspeed: number;
    winddirection: number;
  };
}

const urlGeocoding = "https://geocoding-api.open-meteo.com/v1/search";
const urlForecast = "https://api.open-meteo.com/v1/forecast";
const props = defineProps<Props>();
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.WEATHER,
  content: undefined,
  dateCreation: new Date(),
};

const searchTerm = ref("");
const searchCities: Ref<GeocodingGETResult[]> = ref([]);
const selectedCity: Ref<
  (GeocodingGETResult & ForecastGETResponse) | undefined
> = ref(tile.content);
let selectedCityDTO: GeocodingGETResult;

if (tile.content) {
  selectCity(tile.content);
}

const emit = defineEmits(["submit"]);

watch(searchTerm, (newSearch) => {
  if (searchTerm.value.length < 3) {
    searchCities.value = [];
  } else {
    fetchCities();
  }
});

async function fetchCities() {
  const {
    data: response,
    pending,
    error,
    refresh,
  } = await useFetch<GeocodingGETResponse>(urlGeocoding, {
    params: { name: searchTerm.value },
  });

  searchCities.value = response.value!.results;
}

async function selectCity(city: GeocodingGETResult) {
  searchTerm.value = "";

  const {
    data: response,
    pending,
    error,
    refresh,
  } = await useFetch<ForecastGETResponse>(urlForecast, {
    params: {
      latitude: city.latitude,
      longitude: city.longitude,
      current_weather: true,
      timezone: city.timezone,
    },
  });

  selectedCity.value = { ...city, ...response.value } as GeocodingGETResult &
    ForecastGETResponse;
  selectedCityDTO = city;
}

function onSubmit() {
  tile.content = selectedCityDTO;
  emit("submit", tile);
}

function getWeatherLabel(weatherCode: number) {
  switch (weatherCode) {
    case 0:
      return "Clear sky";
    case 1:
    case 2:
    case 3:
      return "Mainly clear, partly cloudy, and overcast";
    case 45:
    case 48:
      return "Fog and depositing rime fog";
    case 51:
    case 53:
    case 55:
      return "Drizzle: Light, moderate, and dense intensity";
    case 56:
    case 57:
      return "Freezing Drizzle: Light and dense intensity";
    case 61:
    case 63:
    case 65:
      return "Rain: Slight, moderate and heavy intensity";
    case 66:
    case 67:
      return "Freezing Rain: Light and heavy intensity";
    case 71:
    case 73:
    case 75:
      return "Snow fall: Slight, moderate, and heavy intensity";
    case 77:
      return "Snow grains";
    case 80:
    case 81:
    case 82:
      return "Rain showers: Slight, moderate, and violent";
    case 85:
    case 86:
      return "Snow showers slight and heavy";
    case 95:
      return "Thunderstorm: Slight or moderate";
    case 96:
    case 99:
      return "Thunderstorm with slight and heavy hail";
    default:
      return "Unknown";
  }
}
</script>

<style lang="scss" scoped></style>
