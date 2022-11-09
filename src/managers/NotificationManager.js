import BaseManager from "./BaseManager.js";

export default class extends BaseManager {
    /**
     * 
     * @async
     * @param {number|string} count
     * @returns object
     */
    async fetch(count = 1) {
        const data = await this.client.api.notifications(count);
        this.cache.set(count, data);
        return data;
    }
}