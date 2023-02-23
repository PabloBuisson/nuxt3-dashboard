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
        <p>
          Current weather : {{ selectedCity?.current_weather?.weathercode }}
        </p>
      </div>
      <button
        v-if="isWriteRequestAllowed"
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
import { useAuthStore } from "~~/stores/auth-store";
import {
  ForecastGETResponse,
  GeocodingGETResponse,
  GeocodingGETResult,
  useForecastStore,
} from "~~/stores/forecast-store";

interface Props {
  tile?: Tile;
}

const props = defineProps<Props>();
const authStore = useAuthStore();
const isWriteRequestAllowed = computed(() => authStore.isAuthenticated);
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.WEATHER,
  content: undefined,
  dateCreation: new Date(),
};

const store = useForecastStore();
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
  try {
    searchCities.value = await store.fetchCities(searchTerm.value);
  } catch (error) {
    console.log(`fetchCities() error => ${error}`);
  }
}

async function selectCity(city: GeocodingGETResult) {
  searchTerm.value = "";
  try {
    const response = await store.selectCity(city);
    selectedCity.value = { ...city, ...response.value } as GeocodingGETResult &
      ForecastGETResponse;
    selectedCityDTO = city;
  } catch (error) {
    console.log(`selectCity() error => ${error}`);
  }
}

function onSubmit() {
  if (!isWriteRequestAllowed) return;
  tile.content = selectedCityDTO;
  emit("submit", tile);
}
</script>

<style lang="scss" scoped></style>
