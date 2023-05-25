<template>
  <div class="inline-block min-w-[10rem]">
    <h2 class="text-xl text-purple-200 mb-4">Upcoming events</h2>
    <div v-if="events && events.length > 0">
      <ul>
        <li
          class="relative pl-4 text-purple-200 mb-1 before:content[''] before:top-0 before:left-0 before:right-0 before:absolute before:h-full before:w-1 before:rounded"
          :class="getColorBorder(index)"
          v-for="(event, index) in events"
          :key="event.id"
        >
          <NuxtLink :to="'/tile/' + event.tileId">
            <div class="flex items-center gap-4 justify-between">
              <span>
                {{ event.key }}
              </span>
              <span class="text-sm">
                {{ useDateLabel(event.value) }}
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p
        class="relative pl-4 text-purple-100 before:content[''] before:top-0 before:left-0 before:right-0 before:absolute before:h-full before:w-1 before:rounded before:bg-purple-600"
      >
        No upcoming event !
      </p>
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

function getColorBorder(index: number): string {
  switch (index) {
    case 0:
      return "before:bg-purple-600";
    case 1:
      return "before:bg-orange-400";
    case 2:
      return "before:bg-blue-500";
    default:
      return "before:bg-purple-600";
  }
}
</script>

<style scoped></style>
