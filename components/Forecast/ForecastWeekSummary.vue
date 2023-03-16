<template>
  <div>
    <ul>
      <li class="flex justify-between" v-for="(day, index) in daily.time">
        <span>{{ day }}</span>
        <span class="flex items-center gap-2">
          <Icon size="30" :name="useWeatherIcon(daily.weathercode[index])" />
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
</script>

<style scoped></style>
