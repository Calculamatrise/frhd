import BaseManager from "./BaseManager.js";

export default class extends BaseManager {
    async fetch(username) {
        const data = await this.client.api.users(username);

        this.cache.set(username, data);

        return data;
    }
}