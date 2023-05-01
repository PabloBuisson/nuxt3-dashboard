<template>
  <div>
    <h1 class="text-xl bg-purple-300 text-purple-900 py-2 px-3 rounded w-max mb-8">Agenda tile</h1>
    <form @submit.prevent="onSubmit">
      <FormInput id="events-title" v-model="formData.title">Title</FormInput>
      <div class="flex flex-col gap-4">
        <h2 class="font-semibold text-purple-100">Events</h2>
        <FormInputEvent
          v-for="(event, index) in content"
          v-model="formData.events.value[index]"
          :id-event="event.id"
          :key="event.id"
          :id-label="'label-event' + event.id"
          :id-input="'input-event' + event.id"
          @delete-event="deleteEvent(index)"
        />
      </div>
      <button @click="addEvent" type="button">Add event</button>
      <button
        v-if="isWriteRequestAllowed"
        class="px-4 py-2 font-semibold bg-cyan-500 text-white rounded shadow-sm"
        type="submit"
      >
        Update
      </button>
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

const emit = defineEmits(["submit", "error"]);

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
  for (const todo of formData.events.value as EventModelValue[]) {
    if (!todo.label.isValid || !todo.input.isValid) {
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
</script>

<style lang="scss" scoped></style>
