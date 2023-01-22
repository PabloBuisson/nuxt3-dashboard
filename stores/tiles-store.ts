import { Tile, TileCategory } from "~~/models/tile";

interface State {
  _lastFetch: number | null;
  _tiles: Tile[];
}

interface FirebasePOSTResponse {
  name: string;
}

type FirebaseGETResponse = Record<string, Tile>;

export const useTilesStore = defineStore("tiles", {
  state: (): State => ({
    _lastFetch: null,
    _tiles: [
      {
        id: "t1",
        title: "Tile 1",
        category: TileCategory.TODOS,
        content: [
          {
            key: "Promener le chien",
            value: true,
            id: "promener-le-chien",
          },
          {
            key: "Promener le chat",
            value: false,
            id: "promener-le-chat",
          },
        ],
        dateCreation: new Date(),
      },
      {
        id: "t2",
        title: "Tile 2",
        category: TileCategory.EVENT,
        content: [
          { "Promener le chien": new Date() },
          { "Promener le chat": new Date() },
        ],
        dateCreation: new Date(),
      },
      {
        id: "t3",
        title: "Pinia with Nuxt.js",
        standalone: true,
        image: "https://pinia.vuejs.org/logo.svg",
        category: TileCategory.TOREAD,
        contentLink: "https://pinia.vuejs.org/ssr/nuxt.html",
        content: [
          {
            previewText:
              "Using Pinia with Nuxt.js is easier since Nuxt takes care of a lot of things when it comes to server side rendering.",
          },
        ],
        dateCreation: new Date(),
      },
    ],
  }),
  getters: {
    // ⚠ A getter cannot have the same name as another state property.
    tiles(state): Tile[] {
      return state._tiles;
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

      const { data, pending, error, refresh } = (
        await useFetch
      )<FirebasePOSTResponse>(`tiles.json`, {
        method: "PUT",
        body: tile,
        baseURL: config.public.apiBase,
      });

      this.addTile({
        ...tile,
        id: data.value!.name,
      });
    },
    // async registerPartner(data: PartnerRegistration) {
    //   const authStore = useAuthStore();
    //   const partnerId = authStore.userId;
    //   const token = authStore.token;
    //   const partnerData = data;

    //   const response = await fetch(
    //     `${
    //       import.meta.env.VITE_FIREBASE_URL
    //     }/partners/${partnerId}.json?auth=${token}`,
    //     {
    //       method: "PUT",
    //       body: JSON.stringify(partnerData),
    //     }
    //   );

    //   this.registerPartnerMutation({
    //     ...partnerData,
    //     id: partnerId ?? 0,
    //   });
    // },
    async loadTiles(data?: { forceRefresh: boolean }) {
      //   if (!data.forceRefresh && !this.shouldUpdate) {
      //     return;
      //   }
      const config = useRuntimeConfig();
      const {
        data: response,
        pending,
        error,
        refresh,
      } = await useFetch<FirebaseGETResponse>(`tiles.json`, {
        baseURL: config.public.apiBase,
      });

      const responseData = response.value;
      if (error.value) {
        const errorMessage = new Error(error.value.message || "Failed to fetch!");
        throw errorMessage;
      }

      const tiles: Tile[] = [];
      for (const key in responseData) {
        const partner: Tile = {
          id: key,
          title: responseData[key].title,
          standalone: responseData[key].standalone,
          category: responseData[key].category,
          image: responseData[key].image,
          contentLink: responseData[key].contentLink,
          content: responseData[key].content,
          dateCreation: responseData[key].dateCreation,
          dateModification: responseData[key].dateModification,
        };
        tiles.push(partner);
      }
      this.setTiles(tiles);
      this.setFetchTimestamp();
    },
    // mutations can now become actions,
    // instead of `state` as first argument use `this`
    // registerPartnerMutation(data: Partner) {
    //   this._tiles.push(data);
    // },
    addTile(data: Tile) {
      this._tiles.push(data);
    },
    setTiles(data: Tile[]) {
      this._tiles = data;
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
