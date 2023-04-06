<template>
  <div>
    <form @submit.prevent="onSubmit">
      <FormInput id="auth-email" v-model="formData.email" type="email"
        >E-Mail Address</FormInput
      >
      <FormInput id="auth-password" v-model="formData.password" type="password"
        >Password</FormInput
      >
      <button type="submit">{{ submitButtonCaption }}</button>
      <button type="button" @click="switchAuthMode">
        {{ switchModeButtonCaption }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~~/stores/auth-store";

type FormData = {
  [propName in keyof Auth]: ModelValue;
};

interface Auth {
  email: string;
  password: string;
}

const authStore = useAuthStore();
const router = useRouter();

let isLoading = false;
let formIsValid = true;
let mode = ref("login");
let authForm = {} as Auth;
let error = "";
const formData: FormData = {
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
    if (!formData[field as keyof FormData].isValid) {
      formIsValid = false;
      break;
    }
  }
}

function getFormData() {
  for (const field in formData) {
    authForm[field as keyof Auth] = formData[field as keyof FormData].value;
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
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to authenticate, try later.";
      useAppToaster({ message: `${errorMessage}`, type: "danger" });
    }
  } else {
    try {
      await authStore.signup(actionPayload);
      useAppToaster({ message: "Yay ! Welcome.", type: "success" });
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to authenticate, try later.";
      useAppToaster({ message: `${errorMessage}`, type: "danger" });
    }
  }
  // const redirectUrl = "/" + ($route.query.redirect || "partners");
  // $router.replace(redirectUrl);
  router.replace({ path: "/" });
  isLoading = false;
}
</script>

<style lang="scss" scoped></style>
