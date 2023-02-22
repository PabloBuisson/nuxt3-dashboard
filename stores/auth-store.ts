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

interface FirebaseRefreshTokenResponse {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

enum AuthMode {
  Login = "login",
  SignUp = "signup",
}

enum ItemCache {
  token = "token",
  refreshToken = "refreshToken",
  userId = "userId",
  tokenExpiration = "tokenExpiration",
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
    isTokenValid(_): boolean {
      const tokenExpiration =
        localStorage.getItem(ItemCache.tokenExpiration) ?? "0";
      const expiresIn = parseInt(tokenExpiration) - new Date().getTime();

      return expiresIn < 0;
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
        body: {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        },
      });

      const responseData = response.value;

      if (error.value) {
        const errorMessage = new Error(
          error.value.message ||
            "Failed to authenticate. Check your login data."
        );
        throw errorMessage;
      }

      this.saveDataAfterAuth(responseData!);
    },
    saveDataAfterAuth(responseData: FirebaseAuthPOSTResponse) {
      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem(ItemCache.token, responseData.idToken);
      localStorage.setItem(ItemCache.userId, responseData.localId);
      localStorage.setItem(ItemCache.tokenExpiration, `${expirationDate}`);
      localStorage.setItem(ItemCache.refreshToken, responseData.refreshToken);

      // save tokens on server
      const expirationDateJwt = new Date(
        new Date().getTime() + Number.parseInt(responseData.expiresIn) * 1000
      );
      const tokenCookie = useCookie(ItemCache.token, {
        expires: expirationDateJwt,
      });
      const expirationDaysMax = 365;
      const expirationDateMax = new Date(
        Date.now() + expirationDaysMax * 24 * 60 * 60 * 1000
      );
      tokenCookie.value = responseData.idToken;
      const userIdCookie = useCookie(ItemCache.userId, {
        expires: expirationDateMax,
      });
      userIdCookie.value = responseData.localId;
      const refreshTokenCookie = useCookie(ItemCache.refreshToken, {
        expires: expirationDateMax,
      });
      refreshTokenCookie.value = responseData.refreshToken;

      this.setUser({
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    //TODO make one generic method
    saveDataAfterRefreshToken(responseData: FirebaseRefreshTokenResponse) {
      const expiresIn = +responseData.expires_in * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem(ItemCache.token, responseData.id_token);
      localStorage.setItem(ItemCache.userId, responseData.user_id);
      localStorage.setItem(ItemCache.tokenExpiration, `${expirationDate}`);
      localStorage.setItem(ItemCache.refreshToken, responseData.refresh_token);

      // save tokens on server
      const expirationDateJwt = new Date(
        new Date().getTime() + Number.parseInt(responseData.expires_in) * 1000
      );
      const tokenCookie = useCookie(ItemCache.token, {
        expires: expirationDateJwt,
      });
      tokenCookie.value = responseData.id_token;
      const expirationDaysMax = 365;
      const expirationDateMax = new Date(
        Date.now() + expirationDaysMax * 24 * 60 * 60 * 1000
      );
      const userIdCookie = useCookie(ItemCache.userId, {
        expires: expirationDateMax,
      });
      userIdCookie.value = responseData.user_id;
      const refreshTokenCookie = useCookie(ItemCache.refreshToken, {
        expires: expirationDateMax,
      });
      refreshTokenCookie.value = responseData.refresh_token;

      this.setUser({
        token: responseData.id_token,
        userId: responseData.user_id,
      });
    },
    handleSession() {
      // Try to login at start of the app
      // or when a page is refreshed
      if (process.server) {
        const tokenCookie = useCookie(ItemCache.token);
        const userIdCookie = useCookie(ItemCache.userId);

        if (tokenCookie && userIdCookie) {
          this.setUser({
            token: tokenCookie.value,
            userId: userIdCookie.value,
          });
        } else {
          this.refreshToken();
        }
      }

      // only verify if token is still valid
      if (process.client) {
        if (!this.isTokenValid) {
          this.refreshToken();
        }
      }
    },
    //TODO call on request
    async refreshToken() {
      const refreshToken = process.server
        ? useCookie(ItemCache.refreshToken)?.value
        : localStorage.getItem(ItemCache.refreshToken);
      const config = useRuntimeConfig();
      const url = `${config.public.apiRefreshToken}${config.public.apiKey}`;

      const {
        data: response,
        pending,
        error,
        refresh,
      } = await useFetch<FirebaseRefreshTokenResponse>(url, {
        method: "POST",
        body: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
      });

      const responseData = response.value;

      if (error.value) {
        const errorMessage = new Error(
          error.value.message || "Failed to refresh token"
        );
        this.logout();
        throw errorMessage;
      }

      this.saveDataAfterRefreshToken(responseData!);
    },
    logout() {
      // delete cookies
      const tokenCookie = useCookie(ItemCache.token);
      tokenCookie.value = null;
      const refreshTokenCookie = useCookie(ItemCache.refreshToken);
      refreshTokenCookie.value = null;
      const userIdCookie = useCookie(ItemCache.userId);
      userIdCookie.value = null;
      // delete local storage
      if (process.client) {
        localStorage.removeItem(ItemCache.token);
        localStorage.removeItem(ItemCache.refreshToken);
        localStorage.removeItem(ItemCache.userId);
        localStorage.removeItem(ItemCache.tokenExpiration);
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
