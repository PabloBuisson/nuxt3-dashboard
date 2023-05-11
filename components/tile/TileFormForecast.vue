<template>
  <div class="max-w-4xl">
    <h1
      class="text-xl bg-purple-300 text-purple-900 py-2 px-3 rounded w-max mb-8"
    >
      Weather Forecast Tile
    </h1>
    <form @submit.prevent="onSubmit">
      <FormInput id="forecast-title" v-model="formData.title">Title</FormInput>
      <FormAutocomplete @selected="selectCity($event)" />
      <template v-if="selectedCity">
        <div class="rounded mt-8 px-4 pt-4 pb-2 bg-purple-300 text-purple-900">
          <h2 class="font-bold text-xl mb-4">
            Selected city : {{ selectedCity.name }} ({{ selectedCity.country }})
          </h2>

          <h3 class="font-semibold text-lg mb-1">Current weather</h3>
          <ul class="list-disc list-inside mb-4">
            <li>Current temperature : {{ currentTemperature }}</li>
            <li>Current weather : <span class="italic">{{ currentWeather }}</span></li>
            <li>Last update : {{ lastUpdateDate }}</li>
          </ul>
        </div>
        <div
          class="rounded mt-2 p-4 text-purple-100 border-2 border-purple-400"
        >
          <h3 class="font-semibold text-lg mb-2">Week summary</h3>
          <ForecastWeekSummary class="max-w-xs" :daily="selectedCity.daily" />
        </div>
      </template>
      <div class="flex flex-wrap gap-8 mt-12">
        <button
          v-if="isWriteRequestAllowed"
          class="grow max-w-xs px-6 py-2 font-semibold text-lg bg-orange-300 text-orange-900 rounded shadow-sm"
          type="submit"
        >
          Update
        </button>
        <button
          class="grow max-w-xs px-6 py-2 font-semibold text-lg bg-red-300 text-red-900 rounded shadow-sm"
          v-if="isEditPage && isWriteRequestAllowed"
          @click="onDelete"
          type="button"
        >
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { ModelValue } from "~~/models/model-value";
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

interface Forecast {
  title: string;
  city: any;
}

type TileFormData = {
  [propName in keyof Forecast]: ModelValue;
};

const authStore = useAuthStore();
const store = useForecastStore();

const props = defineProps<Props>();
const dateFormat = "dddd DD MMMM hh:mm:ss";
const lastUpdateDate = computed(() => {
  if (selectedCity.value) {
    return useDateFormat(selectedCity.value.current_weather?.time, dateFormat, {
      locales: "en-US",
    }).value;
  }
});
const currentWeather = computed(() => {
  if (selectedCity.value) {
    return useWeatherLabel(selectedCity.value.current_weather?.weathercode);
  }
});
const currentTemperature = computed(() => {
  if (selectedCity.value) {
    return `${selectedCity.value.current_weather?.temperature} °C`;
  }
});
const isWriteRequestAllowed = computed(() => authStore.isAuthenticated);
const isEditPage = computed(() => tile.id !== "");
const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.WEATHER,
  content: undefined,
  dateCreation: new Date(),
};
const selectedCity: Ref<
  (GeocodingGETResult & ForecastGETResponse) | undefined
> = ref(tile.content);
let selectedCityDTO: GeocodingGETResult;
let formIsValid = true;

if (tile.content) {
  await selectCity(tile.content);
}

const formData: TileFormData = {
  title: {
    value: props?.tile?.title ?? "",
    isValid: true,
    validators: ["required"],
  },
  city: {
    value: props?.tile?.content ?? null,
    isValid: true,
  },
};

const emit = defineEmits(["submit", "delete", "error"]);

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

function validateForm() {
  for (const field in formData) {
    if (!formData[field as keyof TileFormData].isValid) {
      formIsValid = false;
      break;
    }
  }
}

function onSubmit() {
  validateForm();
  if (!formIsValid || !isWriteRequestAllowed) {
    emit(
      "error",
      "Oops form is invalid ! Please check all the fields and try again"
    );
    return;
  }

  tile.title = formData.title.value;
  tile.content = selectedCityDTO;
  emit("submit", tile);
}

function onDelete() {
  if (!isWriteRequestAllowed) return;
  emit("delete", tile.id);
}
</script>
