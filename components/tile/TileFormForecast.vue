<template>
  <div>
    <h1>Weather Forecast Tile</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="tile.title" />
      <FormAutocomplete @selected="selectCity($event)" />
      <div v-if="selectedCity">
        <p>
          Selected city : {{ selectedCity.name }} ({{ selectedCity.country }})
        </p>
        <p>
          Current temperature : {{ selectedCity.current_weather?.temperature }}
        </p>
        <p>Current time : {{ selectedCity.current_weather?.time }}</p>
        <p>Current weather : {{ selectedCity.current_weather?.weathercode }}</p>
        <ForecastWeekSummary :daily="selectedCity.daily" />
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
const selectedCity: Ref<
  (GeocodingGETResult & ForecastGETResponse) | undefined
> = ref(tile.content);
let selectedCityDTO: GeocodingGETResult;

if (tile.content) {
  await selectCity(tile.content);
}

const emit = defineEmits(["submit"]);

async function selectCity(city: GeocodingGETResult) {
  try {
    const response = await store.selectCity(city);
    selectedCity.value = { ...city, ...response.value } as GeocodingGETResult &
      ForecastGETResponse;
    selectedCityDTO = city;
  } catch (errorMessage) {
    useAppToaster({ message: `${errorMessage}`, type: "danger" });
  }
}

function onSubmit() {
  if (!isWriteRequestAllowed) return;
  tile.content = selectedCityDTO;
  emit("submit", tile);
}
</script>
