import { Tile, TileCategory } from "~~/models/tile";
import { useTilesStore } from "./tiles-store";

const urlGeocoding = "https://geocoding-api.open-meteo.com/v1/search";
const urlForecast = "https://api.open-meteo.com/v1/forecast";

interface State {
  _lastFetch: number | null;
  _selectedCity: (GeocodingGETResult & ForecastGETResponse) | undefined;
}

export interface ForecastCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  daily: {
    time: string[];
    temperature_2m: number[];
  };
  current_weather: {
    time: string;
    temperature: number;
    weathercode: number;
    windspeed: number;
    winddirection: number;
  };
}

export interface GeocodingGETResult {
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

export interface GeocodingGETResponse {
  results: GeocodingGETResult[];
}

export interface ForecastGETResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: string[];
    temperature_2m_min: string[];
  };
  current_weather: {
    time: string;
    temperature: number;
    weathercode: number;
    windspeed: number;
    winddirection: number;
  };
}

export const useForecastStore = defineStore("forecast", {
  state: (): State => ({
    _lastFetch: null,
    _selectedCity: undefined,
  }),
  getters: {
    // ⚠ A getter cannot have the same name as another state property.
    selectedCity(
      state
    ): (GeocodingGETResult & ForecastGETResponse) | undefined {
      return state._selectedCity;
    },
    shouldUpdate(state): boolean {
      const lastFetch = state._lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    },
  },
  actions: {
    // no context as first argument, use `this` instead
    async fetchCities(searchTerm: string) {
      const {
        data: response,
        pending,
        error,
        refresh,
      } = await useFetch<GeocodingGETResponse>(urlGeocoding, {
        params: { name: searchTerm },
      });

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the cities",
          method: HttpRequestMethod.GET,
        });
      }

      return response.value!.results;
    },
    async selectCity(city: GeocodingGETResult) {
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
          daily: "weathercode,temperature_2m_max,temperature_2m_min",
        },
      });

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the selected city",
          method: HttpRequestMethod.GET,
        });
      }

      this.addSelectedCity({
        ...city,
        ...response.value,
      } as GeocodingGETResult & ForecastGETResponse);

      this.setFetchTimestamp();

      return response;
    },
    // try to fetch the selected city if the information is available in store
    async tryFetchCity() {
      const tilesStore = useTilesStore();

      const tileWeather = tilesStore.tiles.filter(
        (tile) => tile.category === TileCategory.WEATHER
      )[0];
      if (!tileWeather) return;

      const city: GeocodingGETResult = tileWeather.content;

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
          daily: "weathercode,temperature_2m_max,temperature_2m_min",
        },
      });

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the selected city",
          method: HttpRequestMethod.GET,
        });
      }

      this.addSelectedCity({
        ...city,
        ...response.value,
      } as GeocodingGETResult & ForecastGETResponse);

      this.setFetchTimestamp();

      return response;
    },
    // mutations can now become actions,
    // instead of `state` as first argument use `this`
    addSelectedCity(data: GeocodingGETResult & ForecastGETResponse) {
      this._selectedCity = data;
    },
    setFetchTimestamp() {
      this._lastFetch = new Date().getTime();
    },
    // easily reset state using `$reset`
    clearStore() {
      this.$reset();
    },
  },
});
