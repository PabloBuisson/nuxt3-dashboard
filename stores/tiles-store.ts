import { Tile, TileCategory } from "~~/models/tile";
import { useAuthStore } from "./auth-store";

interface State {
  _lastFetch: number | null;
  _tiles: Tile[];
  _groupTiles: Tile[];
  _allTilesLoaded: boolean;
}

interface FirebasePOSTResponse {
  name: string;
}

type FirebaseGETResponse = Record<string, Tile>;

export const useTilesStore = defineStore("tiles", {
  state: (): State => ({
    _lastFetch: null,
    _tiles: [
      // {
      //   id: "t1",
      //   title: "Tile 1",
      //   category: TileCategory.TODOS,
      //   content: [
      //     {
      //       key: "Promener le chien",
      //       value: true,
      //       id: "promener-le-chien",
      //     },
      //     {
      //       key: "Promener le chat",
      //       value: false,
      //       id: "promener-le-chat",
      //     },
      //   ],
      //   dateCreation: new Date(),
      // },
      // {
      //   id: "t2",
      //   title: "Tile 2",
      //   category: TileCategory.EVENT,
      //   content: [
      //     { "Promener le chien": new Date() },
      //     { "Promener le chat": new Date() },
      //   ],
      //   dateCreation: new Date(),
      // },
      // {
      //   id: "t3",
      //   title: "Pinia with Nuxt.js",
      //   standalone: true,
      //   image: "https://pinia.vuejs.org/logo.svg",
      //   category: TileCategory.TOREAD,
      //   contentLink: "https://pinia.vuejs.org/ssr/nuxt.html",
      //   content: [
      //     {
      //       previewText:
      //         "Using Pinia with Nuxt.js is easier since Nuxt takes care of a lot of things when it comes to server side rendering.",
      //     },
      //   ],
      //   dateCreation: new Date(),
      // },
    ],
    _groupTiles: [],
    _allTilesLoaded: false,
  }),
  getters: {
    // ⚠ A getter cannot have the same name as another state property.
    tiles(state): Tile[] {
      return state._tiles;
    },
    groupTiles(state): Tile[] {
      return state._groupTiles;
    },
    hasAllTiles(state): boolean {
      return state._allTilesLoaded && state._tiles && state._tiles.length > 0;
    },
    hasTiles(state): boolean {
      return state._tiles && state._tiles.length > 0;
    },
    shouldUpdate(state): boolean {
      const lastFetch = state._lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    },
  },
  actions: {
    // no context as first argument, use `this` instead
    async registerTile(tile: Tile) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const optionsRequest = {
        method: "POST",
        body: tile,
        baseURL: config.public.apiBase,
        params: { auth: authStore.token },
      };

      // public tiles for demonstration purpose
      let entryPoint: string = `tiles.json`;
      if (authStore.isAuthenticated) {
        // private tiles of current user
        entryPoint = `${authStore.userId}/tiles.json`;
      }

      const { data, pending, error, refresh } =
        await useFetch<FirebasePOSTResponse>(entryPoint, {
          ...optionsRequest,
          async onRequest({ request, options }) {
            if (!authStore.isTokenValid) {
              await authStore.refreshToken();
              options.params = { auth: authStore.token };
            }
          },
          async onResponseError({ request, response, options }) {
            if (response.status === 401) {
              await authStore.refreshToken();
            }
          },
        });

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the tile",
          method: HttpRequestMethod.POST,
        });
      }

      this.addTile({
        ...tile,
        id: data.value!.name,
      });

      return data.value!.name;
    },
    async modifyTile(tile: Tile) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      const optionsRequest = {
        method: "PUT",
        body: tile,
        baseURL: config.public.apiBase,
        params: { auth: authStore.token },
      };

      // public tiles for demonstration purpose
      let entryPoint: string = `tiles/${tile.id}.json`;
      if (authStore.isAuthenticated) {
        // private tiles of current user
        entryPoint = `${authStore.userId}/tiles/${tile.id}.json`;
      }

      const { data, pending, error, refresh } = await useFetch<Tile>(
        entryPoint,
        {
          ...optionsRequest,
          async onRequest({ request, options }) {
            if (!authStore.isTokenValid) {
              await authStore.refreshToken();
              options.params = { auth: authStore.token };
            }
          },
          async onResponseError({ request, response, options }) {
            if (response.status === 401) {
              await authStore.refreshToken();
            }
          },
        }
      );

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the tile",
          method: HttpRequestMethod.PUT,
        });
      }

      this.editTile(tile);
    },
    async deleteTile(tileId: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const optionsRequest = {
        method: "DELETE",
        baseURL: config.public.apiBase,
        params: { auth: authStore.token },
      };

      // public tiles for demonstration purpose
      let entryPoint: string = `tiles/${tileId}.json`;
      if (authStore.isAuthenticated) {
        // private tiles of current user
        entryPoint = `${authStore.userId}/tiles/${tileId}.json`;
      }

      const { data, pending, error, refresh } = await useFetch<Tile>(
        entryPoint,
        {
          ...optionsRequest,
          async onRequest({ request, options }) {
            if (!authStore.isTokenValid) {
              await authStore.refreshToken();
              options.params = { auth: authStore.token };
            }
          },
          async onResponseError({ request, response, options }) {
            if (response.status === 401) {
              await authStore.refreshToken();
            }
          },
        }
      );

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the tile",
          method: HttpRequestMethod.DELETE,
        });
      }

      this.clearTile(tileId);
    },
    async fetchTile(tileId: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      const optionsRequest = {
        method: "GET",
        baseURL: config.public.apiBase,
        params: { auth: authStore.token },
      };

      // public tiles for demonstration purpose
      let entryPoint: string = `tiles/${tileId}.json`;
      if (authStore.isAuthenticated) {
        // private tiles of current user
        entryPoint = `${authStore.userId}/tiles/${tileId}.json`;
      }

      const {
        data: response,
        pending,
        error,
        refresh,
      } = await useFetch<Tile>(entryPoint, {
        ...optionsRequest,
        async onRequest({ request, options }) {
          if (!authStore.isTokenValid) {
            await authStore.refreshToken();
            options.params = { auth: authStore.token };
          }
        },
        async onResponseError({ request, response, options }) {
          if (response.status === 401) {
            await authStore.refreshToken();
          }
        },
      });

      const responseData = response.value;

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the tile",
          method: HttpRequestMethod.GET,
        });
      }

      const tile: Tile = {
        id: tileId,
        title: responseData!.title,
        isPinned: responseData!.isPinned,
        category: responseData!.category,
        image: responseData!.image,
        contentLink: responseData!.contentLink,
        content: responseData!.content,
        dateCreation: responseData!.dateCreation,
        dateModification: responseData!.dateModification,
      };
      this.addTile(tile);
      this.setFetchTimestamp();
    },
    async loadTiles(settings?: { forceRefresh?: boolean }) {
      if (this.hasAllTiles && !this.shouldUpdate && !settings?.forceRefresh) {
        return;
      }

      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const optionsRequest = {
        method: "GET",
        baseURL: config.public.apiBase,
        params: { auth: authStore.token },
      };

      // public tiles for demonstration purpose
      let entryPoint: string = `tiles.json`;
      if (authStore.isAuthenticated) {
        // private tiles of current user
        entryPoint = `${authStore.userId}/tiles.json`;
      }

      const {
        data: response,
        pending,
        error,
        refresh,
      } = await useFetch<FirebaseGETResponse>(entryPoint, {
        ...optionsRequest,
        async onRequest({ request, options }) {
          if (!authStore.isTokenValid) {
            await authStore.refreshToken();
            options.params = { auth: authStore.token };
          }
        },
        async onResponseError({ request, response, options }) {
          if (response.status === 401) {
            await authStore.refreshToken();
          }
        },
      });

      const responseData = response.value;

      if (error.value) {
        throw useErrorMessage({
          error: error.value.status,
          entity: "the tiles",
          method: HttpRequestMethod.GET,
        });
      }

      const tiles: Tile[] = [];
      for (const key in responseData) {
        const tile: Tile = {
          id: key,
          title: responseData[key].title,
          isPinned: responseData[key].isPinned,
          category: responseData[key].category,
          image: responseData[key].image,
          contentLink: responseData[key].contentLink,
          content: responseData[key].content,
          dateCreation: responseData[key].dateCreation,
          dateModification: responseData[key].dateModification,
        };
        tiles.push(tile);
      }
      this.setTiles(tiles);
      this.setFetchTimestamp();
      this.setAllTilesHasBeenLoaded();

      return tiles;
    },
    // mutations can now become actions,
    // instead of `state` as first argument use `this`
    addTile(data: Tile) {
      if (!this._tiles) return;

      if (this._tiles.length === 0) {
        this._tiles.push(data);
      } else {
        const tileIndex = this._tiles.findIndex((tile) => tile.id === data.id);
        tileIndex != -1
          ? (this._tiles[tileIndex] = data)
          : this._tiles.push(data);
      }
    },
    addGroupTile(data: Tile) {
      if (!this._groupTiles) return;

      if (this._groupTiles.length === 0) {
        this._groupTiles.push(data);
      } else {
        const tileIndex = this._groupTiles.findIndex(
          (tile) => tile.id === data.id
        );
        tileIndex != -1
          ? (this._groupTiles[tileIndex] = data)
          : this._groupTiles.push(data);
      }
    },
    editTile(data: Tile) {
      const tileIndex = this._tiles.findIndex((tile) => tile.id === data.id);
      this._tiles[tileIndex] = data;
    },
    clearTile(tileId: string) {
      this._tiles = this._tiles.filter((tile) => tile.id !== tileId);
    },
    setTiles(data: Tile[]) {
      this._tiles = data;
    },
    setAllTilesHasBeenLoaded() {
      this._allTilesLoaded = true;
    },
    setFetchTimestamp() {
      this._lastFetch = new Date().getTime();
    },
    // easily reset state using `$reset`
    clearStore() {
      this.$reset();
    },
  },
});
