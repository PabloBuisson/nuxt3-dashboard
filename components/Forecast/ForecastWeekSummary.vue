<template>
  <div>
    <ul>
      <li v-for="(day, index) in daily.time">
        {{ day }} - {{ useWeatherLabel(daily.weathercode[index]) }} -
        {{ daily.temperature_2m_max[index] }}/{{
          daily.temperature_2m_min[index]
        }}
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
</script>

<style scoped></style>
