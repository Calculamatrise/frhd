import BaseManager from "./BaseManager.js";

import LimitedMap from "../utils/LimitedMap.js";

export default class extends BaseManager {
    #cache = new LimitedMap({ limit: 200 });
    get cache() {
        return this.#cache;
    }
    async fetch(id) {
        const data = await this.client.api.cosmetics(id);

        if (typeof id !== "object" && !Array.isArray(id))
            this.#cache.set(id, data);

        return data;
    }
}