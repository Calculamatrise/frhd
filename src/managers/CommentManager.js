import BaseManager from "./BaseManager.js";
import RequestHandler from "../utils/RequestHandler.js";
import Comment from "../structures/Comment.js";

export default class extends BaseManager {
	/**
	 * 
	 * @param {object} [options]
	 * @param {boolean} [options.force]
	 * @returns {Comment}
	 */
	async fetch(id, { force = false }) {
		if (!force && this.cache.has(id)) {
			return this.cache.get(id);
		}

		// use 'show more' to find endpoint
		const entry = await RequestHandler.post("track_comments/load_more/" + this.client.id).then(res => new Comment(res));
		entry && this.cache.set(id, entry);
		return entry;
	}

	/**
	 * 
	 * @param {string} message 
	 * @returns {Promise<Comment>}
	 */
	post(message) {
		return RequestHandler.post("track_comments/post", {
			t_id: this.client.id,
			msg: String(message).replace(/\s+/g, "+")
		}, true).then(res => new Comment(res));
	}

	delete() {}
}