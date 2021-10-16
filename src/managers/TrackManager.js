import BaseManager from "./BaseManager.js";

export default class extends BaseManager {
    async fetch(id) {
        const data = await this.client.api.tracks(id);
        
        this.cache.set(id, data);

        return data;
    }
}