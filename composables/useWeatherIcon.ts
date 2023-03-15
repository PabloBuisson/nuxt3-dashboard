/**
 * Return the icon name related to a weather code
 * @param weathercode a code as number representing weather
 * @returns the name of the icon
 */
export const useWeatherIcon = (weathercode: number): string => {
  if (!weathercode) {
    return "fluent-mdl2:sun-question-mark";
  }
  switch (weathercode) {
    case 0:
      return "fluent:weather-sunny-24-filled";
    case 1:
    case 2:
    case 3:
      return "fluent:weather-partly-cloudy-day-24-filled";
    case 45:
    case 48:
      return "fluent:weather-fog-24-filled";
    case 51:
    case 53:
    case 55:
      return "fluent:weather-drizzle-24-filled";
    case 56:
    case 57:
      return "fluent:weather-drizzle-24-filled";
    case 61:
    case 63:
    case 65:
      return "fluent:weather-drizzle-24-filled";
    case 66:
    case 67:
      return "fluent:weather-drizzle-24-filled";
    case 71:
    case 73:
    case 75:
      return "fluent:weather-snow-24-filled";
    case 77:
      return "fluent:weather-snow-24-filled";
    case 80:
    case 81:
    case 82:
      return "fluent:weather-rain-24-filled";
    case 85:
    case 86:
      return "fluent:weather-snow-24-filled";
    case 95:
      return "fluent:weather-thunderstorm-24-filled";
    case 96:
    case 99:
      return "fluent:weather-thunderstorm-24-filled";
    default:
      return "fluent-mdl2:sun-question-mark";
  }
};
