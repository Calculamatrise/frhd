import BaseManager from "./BaseManager.js";
import RequestHandler from "../utils/RequestHandler.js";
import Comment from "../structures/Comment.js";

export default class extends BaseManager {
	/**
	 * 
	 * @async
	 * @param {object} [options]
	 * @param {boolean} [options.force]
	 * @returns {Promise<Comment>}
	 */
	async fetch(id, { force = false }) {
		if (!force && this.cache.has(id)) {
			return this.cache.get(id);
		}
		// use 'show more' to find endpoint
		const entry = await RequestHandler.post("track_comments/load_more/" + this.client.id).then(res => new Comment(Object.assign({ track: this.client }, res.track_comments[0])));
		entry && this.cache.set(id, entry);
		return entry ?? null
	}

	/**
	 * 
	 * @param {string} data 
	 * @returns {Promise<Comment>}
	 */
	post(data) {
		typeof data == 'object' && (data = data.content);
		if (typeof data != 'string') throw new TypeError("Content must be of type: string");
		else if (data.length < 4) throw new RangeError("Comment is too short!");
		else if (data.length > 500) throw new RangeError("Yo, comment too long! Must be 500 characters or less.");
		return RequestHandler.post("track_comments/post", {
			t_id: this.client.id,
			msg: data.replace(/\s+/g, '+')
		}, true).then(res => new Comment(res));
	}

	delete(id, { timeout = 0 } = {}) {
		typeof id == 'object' && (timeout ||= id.timeout,
		id = id.id);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				RequestHandler.get(`track_comments/delete/${this.client.id}/${id}`, true)
				.then(resolve)
				.catch(reject);
			}, timeout | 0);
		});
	}
}