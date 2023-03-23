<template>
  <div>
    <ul>
      <li class="flex justify-between" v-for="(day, index) in daily.time">
        <span>{{ useDateLabel(day, DateSeparator.Dash) }}</span>
        <span class="flex items-center gap-2">
          <div :title="useWeatherLabel(daily.weathercode[index])">
            <span class="sr-only">{{ useWeatherLabel(daily.weathercode[index]) }}</span>
            <Icon size="30" :name="useWeatherIcon(daily.weathercode[index])" />
          </div>
          <span
            >{{ daily.temperature_2m_max[index] }}/{{
              daily.temperature_2m_min[index]
            }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface DailyProp {
  time: string[];
  weathercode: number[];
  temperature_2m_max: string[];
  temperature_2m_min: string[];
}

interface Props {
  daily: DailyProp;
}

const props = defineProps<Props>();

const dateLabel = computed((day) => useDateLabel(day));
</script>

<style scoped></style>
