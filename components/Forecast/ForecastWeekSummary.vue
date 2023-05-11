<template>
  <div>
    <ul>
      <li
        class="flex flex-wrap items-center gap-x-4 justify-between mb-1 last:mb-0"
        v-for="(day, index) in daily.time"
      >
        <span class="block">{{ useDateLabel(day, DateSeparator.Dash) }}</span>
        <span class="flex items-center gap-2">
          <div :title="useWeatherLabel(daily.weathercode[index])">
            <span class="sr-only">{{
              useWeatherLabel(daily.weathercode[index])
            }}</span>
            <Icon
              size="30"
              class="text-orange-200"
              :name="useWeatherIcon(daily.weathercode[index])"
            />
          </div>
          <span>
            {{ daily.temperature_2m_max[index] }}/{{
              daily.temperature_2m_min[index]
            }}
            °C
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
