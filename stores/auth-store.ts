interface State {
  _userId: string | null;
  _token: string | null;
  _didAutoLogout: boolean;
}

interface FirebaseAuthPOSTResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

enum AuthMode {
  Login = "login",
  SignUp = "signup",
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    _userId: null,
    _token: null,
    _didAutoLogout: false,
  }),
  getters: {
    userId(state): string | null {
      return state._userId;
    },
    token(state): string | null {
      return state._token;
    },
    isAuthenticated(state): boolean {
      return !!state._token;
    },
    didAutoLogout(state): boolean {
      return state._didAutoLogout;
    },
  },
  actions: {
    // no context as first argument, use `this` instead
    async login(payload: any) {
      return this.auth({
        ...payload,
        mode: AuthMode.Login,
      });
    },
    async signup(payload: any) {
      return this.auth({
        ...payload,
        mode: AuthMode.SignUp,
      });
    },
    async auth(payload: any) {
      const config = useRuntimeConfig();
      const mode = payload.mode;

      const url =
        mode === "login"
          ? `${config.public.apiAuthLogin}${config.public.apiKey}`
          : `${config.public.apiAuthSignup}${config.public.apiKey}`;

      const {
        data: response,
        pending,
        error,
        refresh,
      } = await useFetch<FirebaseAuthPOSTResponse>(url, {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });

      const responseData = response.value;

      if (error.value) {
        const errorMessage = new Error(
          error.value.message ||
            "Failed to authenticate. Check your login data."
        );
        throw errorMessage;
      }

      const expiresIn = +responseData!.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem("token", responseData!.idToken);
      localStorage.setItem("userId", responseData!.localId);
      localStorage.setItem("tokenExpiration", `${expirationDate}`);

      // save tokens on server
      const expirationDateJwt = new Date(
        new Date().getTime() + Number.parseInt(responseData!.expiresIn) * 1000
      );
      const jwtCookie = useCookie("jwt", { expires: expirationDateJwt });
      jwtCookie.value = responseData!.idToken;
      const userIdCookie = useCookie("userId");
      userIdCookie.value = responseData!.localId;

      this.setUser({
        token: responseData!.idToken,
        userId: responseData!.localId,
      });
    },
    handleSession() {
      // Try to login at start of the app
      // or when a page is refreshed
      if (process.server) {
        const jwtCookie = useCookie("jwt");
        const userIdCookie = useCookie("userId");

        if (jwtCookie && userIdCookie) {
          this.setUser({
            token: jwtCookie.value,
            userId: userIdCookie.value,
          });
        } else {
          this.logout();
        }
      }

      // only verify if token is still valid
      if (process.client) {
        const tokenExpiration = localStorage.getItem("tokenExpiration") ?? "0";

        const expiresIn = parseInt(tokenExpiration) - new Date().getTime();

        if (expiresIn < 0) {
          this.logout();
        }
      }
    },
    logout() {
      // delete cookies
      const jwtCookie = useCookie("jwt");
      jwtCookie.value = null;
      const userIdCookie = useCookie("userId");
      userIdCookie.value = null;
      // delete local storage
      if (process.client) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("tokenExpiration");
      }

      this.setUser({
        token: null,
        userId: null,
      });
    },
    autoLogout() {
      this.logout();
      this.setAutoLogout();
    },
    // mutations can now become actions,
    // instead of `state` as first argument use `this`
    setUser(payload: { token: string | null; userId: string | null }) {
      this._token = payload.token;
      this._userId = payload.userId;
      this._didAutoLogout = false;
    },
    setAutoLogout() {
      this._didAutoLogout = true;
    },
    // easily reset state using `$reset`
    clearStore() {
      this.$reset();
    },
  },
});
