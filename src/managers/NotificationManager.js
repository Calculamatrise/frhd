import BaseManager from "./BaseManager.js";

import LimitedMap from "../utils/LimitedMap.js";

export default class extends BaseManager {
    #cache = new LimitedMap({ limit: 10000 });
    get cache() {
        return this.#cache;
    }
    async fetch(count) {
        const data = await this.client.api.notifications(count);

        this.#cache.set(count, data);

        return data;
    }
}