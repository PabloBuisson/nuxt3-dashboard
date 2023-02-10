import { Tile, TileCategory } from "~~/models/tile";

const urlGeocoding = "https://geocoding-api.open-meteo.com/v1/search";
const urlForecast = "https://api.open-meteo.com/v1/forecast";

interface State {
  _lastFetch: number | null;
  _selectedCity: (GeocodingGETResult & ForecastGETResponse) | undefined;
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
        },
      });

      this.addSelectedCity({
        ...city,
        ...response.value,
      } as GeocodingGETResult & ForecastGETResponse);

      return response;
    },
    getWeatherLabel(weatherCode: number) {
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
    // easily reset state using `$reset`
    clearStore() {
      this.$reset();
    },
  },
});
