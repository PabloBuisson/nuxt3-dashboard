<template>
  <div class="flex justify-center">
    <form @submit.prevent="onSubmit" class="flex flex-col mt-4">
      <FormInput id="auth-email" v-model="formData.email" type="email"
        >E-Mail address</FormInput
      >
      <FormInput id="auth-password" v-model="formData.password" type="password"
        >Password</FormInput
      >
      <button
        type="submit"
        class="mt-4 px-6 py-2 font-semibold text-lg bg-orange-300 text-orange-900 rounded shadow-sm mb-4"
      >
        {{ submitButtonCaption }}
      </button>
      <button
        type="button"
        @click="switchAuthMode"
        class="px-6 py-2 font-semibold text-lg bg-purple-300 text-purple-900 rounded shadow-sm"
      >
        {{ switchModeButtonCaption }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ModelValue } from "~~/models/model-value";
import { useAuthStore } from "~~/stores/auth-store";

type AuthFormData = {
  [propName in keyof Auth]: ModelValue;
};

interface Auth {
  email: string;
  password: string;
}

useHead({
  title: "Log in or Sign up",
});
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

let isLoading = false;
let formIsValid = true;
const modeQuery = route.query.mode;
let mode = ref(modeQuery ?? "login");
let authForm = {} as Auth;
let error = "";
const formData: AuthFormData = {
  email: {
    value: "",
    isValid: true,
    validators: ["required"],
  },
  password: {
    value: "",
    isValid: true,
    validators: ["required"],
  },
};

const submitButtonCaption = computed(() =>
  mode.value === "login" ? "Login" : "Signup"
);
const switchModeButtonCaption = computed(() =>
  mode.value === "login" ? "Signup instead" : "Login instead"
);

function switchAuthMode() {
  if (mode.value === "login") {
    mode.value = "signup";
  } else {
    mode.value = "login";
  }
}

function validateForm() {
  formIsValid = true;
  for (const field in formData) {
    if (!formData[field as keyof AuthFormData].isValid) {
      formIsValid = false;
      break;
    }
  }
}

function getFormData() {
  for (const field in formData) {
    authForm[field as keyof Auth] = formData[field as keyof AuthFormData].value;
  }
}

async function onSubmit() {
  isLoading = true;
  validateForm();
  if (!formIsValid) {
    console.log("formInvalid");
    isLoading = false;
    return;
  }
  getFormData();
  const actionPayload = {
    email: authForm.email,
    password: authForm.password,
  };
  console.log("formValid", actionPayload);

  if (mode.value === "login") {
    try {
      await authStore.login(actionPayload);
      useAppToaster({
        message: "Yay ! Sucessfully logged in.",
        type: "success",
      });
      redirectToHomePage();
    } catch (errorMessage) {
      useAppToaster({ message: `${errorMessage}`, type: "danger" });
      isLoading = false;
    }
  } else {
    try {
      await authStore.signup(actionPayload);
      useAppToaster({ message: "Yay ! Welcome.", type: "success" });
      redirectToHomePage();
    } catch (errorMessage) {
      useAppToaster({ message: `${errorMessage}`, type: "danger" });
      isLoading = false;
    }
  }
}

function redirectToHomePage() {
  const redirectUrl = "/" + (route.query.redirect ?? "");
  const lastPath: string = router.options.history.state.back as string;
  const path: string =
    redirectUrl != "/" ? redirectUrl : lastPath ?? redirectUrl;
  // $router.replace(redirectUrl);
  navigateTo({ path: "/", query: { forcerefresh: "true" } }, { replace: true });
  // router.getRoutes().forEach((route) => {
  //   if (route.name && route.name != "/") {
  //     router.removeRoute(route.name as RouteRecordName);
  //   }
  // });
  isLoading = false;
}
</script>

<style lang="scss" scoped></style>
