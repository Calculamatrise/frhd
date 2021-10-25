import BaseManager from "./BaseManager.js";

export default class extends BaseManager {
    /**
     * 
     * @async
     * @param {number|string} id
     * @returns object
     */
    async fetch(id) {
        const data = await this.client.api.cosmetics(id);

        if (typeof id !== "object" && !Array.isArray(id))
            this.cache.set(id, data);

        return data;
    }
}