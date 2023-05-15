<template>
  <div class="inline-block">
    <h2 class="text-xl text-purple-200 mb-4">Upcoming events</h2>
    <div v-if="events && events.length > 0">
      <ul>
        <li
          class="rounded border-l-4 border-orange-300 pl-4 mb-2 text-purple-100"
          v-for="event in events"
          :key="event.id"
        >
          <NuxtLink :to="'/tile/' + event.tileId">
            <div class="flex items-center gap-4 justify-between">
              <span>
                {{ event.key }}
              </span>
              <span>
                {{ useDateLabel(event.value) }}
              </span>
            </div>
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
