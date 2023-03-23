<template>
  <div class="inline-block">
    <h2 class="text-2xl">Upcoming events</h2>
    <div
      v-if="events && events.length > 0"
      class="bg-white shadow rounded border inline-block p-4"
    >
      <ul>
        <li v-for="event in events" :key="event.id">
          <NuxtLink :to="'/tile/' + event.tileId"
            >{{ event.key }} = {{ useDateLabel(event.value) }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No upcoming event !</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TileCategory } from "~~/models/tile";
import { useTilesStore } from "~~/stores/tiles-store";

interface UpcomingEvent {
  id: string;
  key: string;
  tileId: string;
  value: string;
}

const store = useTilesStore();
const events = computed(() => {
  const upcomingEvents: UpcomingEvent[] = [];
  const eventTiles = store.tiles.filter(
    (tile) => tile.category === TileCategory.EVENT
  );

  if (eventTiles && eventTiles.length > 0) {
    const eventsToDisplay: UpcomingEvent[] = [];

    for (const tile of eventTiles) {
      if (tile.content && tile.content.length > 0) {
        for (const event of tile.content) {
          // only keep future dates and today dates
          if (
            useDateStringToDate(event.value).getTime() > new Date().getTime() ||
            useDateStringToDate(event.value).toDateString() ===
              new Date().toDateString()
          ) {
            eventsToDisplay.push({ ...event, tileId: tile.id });
          }
        }
      }
    }

    if (eventsToDisplay.length > 0) {
      eventsToDisplay
        .sort(
          (event1, event2) =>
            useDateStringToDate(event1.value).getTime() -
            useDateStringToDate(event2.value).getTime()
        )
        ?.slice(0, 3);
      upcomingEvents.push(...eventsToDisplay);
    }
  }

  return upcomingEvents;
});
</script>

<style scoped></style>
