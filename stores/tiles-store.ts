import { Tile, TileCategory } from "~~/models/tile";

interface State {
  _lastFetch: number | null;
  _tiles: Tile[];
}

export const useTilesStore = defineStore("tiles", {
  state: (): State => ({
    _lastFetch: null,
    _tiles: [
      {
        id: "t1",
        title: "Tile 1",
        category: TileCategory.TODOS,
        content: [{ "Promener le chien": true }, { "Promener le chat": false }],
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
    // isPartner(): boolean {
    //   // other getters now on `this`
    //   const partners = this.tiles;
    //   // const userId = rootGetters.userId; TODO
    //   return partners.some((partner: Partner) => partner.id === "userId");
    // },
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
    async loadTiles(payload: { forceRefresh: boolean }) {
      //   if (!payload.forceRefresh && !this.shouldUpdate) {
      //     return;
      //   }
      //   const response = await fetch(
      //     `${import.meta.env.VITE_FIREBASE_URL}/partners.json`
      //   );
      //   const responseData = await response.json();
      //   if (!response.ok) {
      //     const error = new Error(responseData.message || "Failed to fetch!");
      //     throw error;
      //   }
      //   const partners: Partner[] = [];
      //   for (const key in responseData) {
      //     const partner: Partner = {
      //       id: key,
      //       firstName: responseData[key].firstName,
      //       lastName: responseData[key].lastName,
      //       description: responseData[key].description,
      //       pseudo: responseData[key].pseudo,
      //       email: responseData[key].email,
      //       langNative: responseData[key].langNative,
      //       langPractice: responseData[key].langPractice,
      //       level: responseData[key].level,
      //       interests: responseData[key].interests,
      //       exchange: responseData[key].exchange,
      //     };
      //     partners.push(partner);
      //   }
      //   this.setTiles(partners);
      //   this.setFetchTimestamp();
    },
    // mutations can now become actions,
    // instead of `state` as first argument use `this`
    // registerPartnerMutation(payload: Partner) {
    //   this._tiles.push(payload);
    // },
    setTiles(payload: Tile[]) {
      this._tiles = payload;
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
