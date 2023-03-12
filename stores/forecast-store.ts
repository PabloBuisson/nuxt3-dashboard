import { Tile, TileCategory } from "~~/models/tile";

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

      this.addSelectedCity({
        ...city,
        ...response.value,
      } as GeocodingGETResult & ForecastGETResponse);

      this.setFetchTimestamp();

      return response;
    },
    // async registerPartner(data: PartnerRegistration) {
    //   const authStore = useAuthStore();
    //   const partnerId = authStore.userId;
    //   const token = authStore.token;
    //   const partnerData = data;

    //   const response = await fetch(
    //     `${
    //       import.meta.env.VITE_FIREBASE_URL
    //     }/partners/${partnerId}.json?auth=${token}`,
    //     {
    //       method: "PUT",
    //       body: JSON.stringify(partnerData),
    //     }
    //   );

    //   this.registerPartnerMutation({
    //     ...partnerData,
    //     id: partnerId ?? 0,
    //   });
    // },
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
