<template>
  <div>
    <h1
      class="text-xl bg-purple-300 text-purple-900 py-2 px-3 rounded w-max mb-8"
    >
      Tile Events
    </h1>
    <form @submit.prevent="onSubmit" class="max-w-[35rem]">
      <FormInput id="events-title" v-model="formData.title">Title</FormInput>
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-8 justify-start items-center">
          <h2 class="font-semibold text-purple-100">Events</h2>
          <!-- <button
            class="px-6 py-2 font-semibold text-base bg-orange-300 text-orange-900 rounded shadow-sm"
            @click="addEvent"
            type="button"
          >
            Add event
          </button> -->
        </div>
        <div class="flex flex-col gap-8">
          <FormInputEvent
            v-for="(event, index) in content"
            v-model="formData.events.value[index]"
            :id-event="event.id"
            :key="event.id"
            :id-label="'label-event' + event.id"
            :id-input="'input-event' + event.id"
            @delete-event="deleteEvent(index)"
          />
          <button
            class="px-6 py-2 mx-auto font-semibold text-base bg-orange-300 text-orange-900 rounded shadow-sm"
            @click="addEvent"
            type="button"
          >
            Add event
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-8 mt-12">
        <button
          v-if="isWriteRequestAllowed"
          class="grow max-w-xs px-6 py-2 font-semibold text-lg bg-orange-300 text-orange-900 rounded shadow-sm"
          type="submit"
        >
          Update
        </button>
        <button
          class="grow max-w-xs px-6 py-2 font-semibold text-lg bg-red-300 text-red-900 rounded shadow-sm"
          v-if="isEditPage && isWriteRequestAllowed"
          @click="onDelete"
          type="button"
        >
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ModelValue } from "~~/models/model-value";
import { Tile, TileCategory } from "~~/models/tile";
import { useAuthStore } from "~~/stores/auth-store";

interface Props {
  tile?: Tile;
}

interface Event {
  key: string;
  value: string;
  id: string;
}

interface Events {
  title: string;
  events: any;
}

interface EventModelValue {
  id: string;
  label: ModelValue;
  input: ModelValue;
}

type TileFormData = {
  [propName in keyof Events]: ModelValue;
};

const props = defineProps<Props>();
const authStore = useAuthStore();
const isWriteRequestAllowed = computed(() => authStore.isAuthenticated);
const isEditPage = computed(() => tile.id !== "");
let formIsValid = true;

const tile: Tile = props.tile ?? {
  id: "",
  title: "",
  category: TileCategory.EVENT,
  content: "",
  dateCreation: new Date(),
};

if (props.tile && props.tile.content?.length > 0) {
  props.tile.content.sort(
    (a: Event, b: Event) =>
      useDateStringToDate(a.value).getTime() -
      useDateStringToDate(b.value).getTime()
  );
}

const content = props.tile
  ? ref(props.tile.content as Event[])
  : ref([
      {
        key: "Event1",
        value: "",
        id: "1",
      },
    ]);

const eventsModelValue: EventModelValue[] = [];
initTodoForm();

function initTodoForm() {
  for (const event of content.value as Event[]) {
    const eventModelValue: EventModelValue = {
      id: event.id,
      label: {
        value: event.key,
        isValid: true,
        validators: ["required"],
      },
      input: {
        value: event.value,
        isValid: true,
        validators: ["required"],
      },
    };
    eventsModelValue.push(eventModelValue);
  }
}

const formData: TileFormData = {
  title: {
    value: props?.tile?.title ?? "",
    isValid: true,
    validators: ["required"],
  },
  events: {
    value: eventsModelValue,
    isValid: true,
  },
};

const emit = defineEmits(["submit", "delete", "error"]);

function addEvent() {
  let lastEventId: number = 1;
  for (const event of content.value as Event[]) {
    if (typeof +event.id === "number" && +event.id > lastEventId) {
      lastEventId = +event.id;
    }
  }
  const newEvent: Event = {
    key: `Event${lastEventId + 1}`,
    value: "",
    id: `${lastEventId + 1}`,
  };
  content.value.push(newEvent);
  addEventToModelValue(newEvent);
}

function addEventToModelValue(event: Event) {
  const eventModelValue: EventModelValue = {
    id: event.id,
    label: {
      value: event.key,
      isValid: true,
      validators: ["required"],
    },
    input: {
      value: event.value,
      isValid: true,
      validators: ["required"],
    },
  };
  formData.events.value.push(eventModelValue);
}

function validateForm() {
  formIsValid = true;
  for (const event of formData.events.value as EventModelValue[]) {
    if (!event.label.isValid || !event.input.isValid) {
      formIsValid = false;
      return;
    }
  }

  for (const field in formData) {
    if (!formData[field as keyof TileFormData].isValid) {
      formIsValid = false;
      break;
    }
  }
}

function onSubmit() {
  validateForm();
  if (!formIsValid || !isWriteRequestAllowed) {
    emit(
      "error",
      "Oops form is invalid ! Please check all the fields and try again"
    );
    return;
  }

  const eventsToSave = [];
  for (const event of formData.events.value as EventModelValue[]) {
    const eventToSave: Event = {
      id: event.id,
      key: event.label.value,
      value: event.input.value,
    };
    eventsToSave.push(eventToSave);
  }

  tile.title = formData.title.value;
  tile.content = eventsToSave;

  emit("submit", tile);
}

function deleteEvent(index: number) {
  if (!isWriteRequestAllowed) return;
  const eventToDelete = content.value[index];
  formData.events.value = formData.events.value.filter(
    (event: EventModelValue) => event.id != eventToDelete.id
  );
  content.value = content.value.filter(
    (event: Event) => event.id !== eventToDelete.id
  );
}

function onDelete() {
  if (!isWriteRequestAllowed) return;
  emit("delete", tile.id);
}
</script>

<style lang="scss" scoped></style>
