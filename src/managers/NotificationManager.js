import BaseManager from "./BaseManager.js";

export default class extends BaseManager {
    async fetch(count) {
        const data = await this.client.api.notifications(count);

        this.cache.set(count, data);

        return data;
    }
}