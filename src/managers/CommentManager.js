import RequestHandler from "../utils/RequestHandler.js";
import BaseManager from "./BaseManager.js";
import Comment from "../structures/Comment.js";

export default class extends BaseManager {
    /**
     * 
     * @param {object} options
     * @param {boolean} options.force
     * @returns {Comment}
     */
    async fetch(id, { force = false }) {
        if (force || !this.cache.has(id)) {
            // use 'show more' to find endpoint
            const entry = await RequestHandler.post("/track_comments/get", {
                t_id: this.client.id
            }, true).then(function(response) {
                if (response.result) {
                    return new Comment(response.data.track_comments[0]);
                }

                return new Error(response.msg);
            });
            entry && this.cache.set(id, entry);
        }

        return this.cache.get(id);
    }

    async post(message) {
        return RequestHandler.post("/track_comments/post", {
            t_id: this.client.id,
            msg: String(message).replace(/\s+/g, "+")
        }, true).then(function(response) {
            if (response.result) {
                return new Comment(response.data.track_comments[0]);
            }

            return new Error(response.msg);
        });
    }
}