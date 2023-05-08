<template>
  <div>
    <label class="block text-purple-100 font-semibold mb-2" for="autocomplete-city"
      >How is the weather in your city ?</label
    >
    <input
      type="text"
      id="autocomplete-city"
      v-model="searchTerm"
      class="w-full bg-purple-100 border border-purple-300 text-purple-900 rounded focus:ring-purple-500 focus:border-purple-500 invalid:border-red-400 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
    />
    <div
      v-show="searchCities.length > 0"
      class="bg-purple-50 mt-2 text-purple-900 rounded"
    >
      <ul class="divide-y divide-purple-200 cursor-pointer rounded">
        <li
          v-for="city in searchCities"
          :key="city.id"
          class="odd:bg-purple-50 even:bg-purple-100 p-2.5 last:rounded-b first:rounded-t"
          @click="selectCity(city)"
        >
          {{ city.name }} ({{ city.country }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "nuxt/dist/app/compat/capi";
import { GeocodingGETResult, useForecastStore } from "~~/stores/forecast-store";

const store = useForecastStore();
const searchTerm = ref("");
const searchCities: Ref<GeocodingGETResult[]> = ref([]);

const emit = defineEmits(["selected"]);

function selectCity(city: GeocodingGETResult) {
  searchTerm.value = "";
  emit("selected", city);
}

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
  } catch (errorMessage) {
    useAppToaster({ message: `${errorMessage}`, type: "danger" });
  }
}
</script>
