import BaseManager from "./BaseManager.js";

import LimitedMap from "../utils/LimitedMap.js";

export default class extends BaseManager {
    #cache = new LimitedMap({ limit: 10000 });
    get cache() {
        return this.#cache;
    }
    async fetch(username) {
        const data = await this.client.api.users(username);

        this.#cache.set(username, data);

        return data;
    }
}