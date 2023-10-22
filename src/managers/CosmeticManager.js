import BaseManager from "./BaseManager.js";
import RequestHandler from "../utils/RequestHandler.js";

export default class extends BaseManager {
	/**
	 * 
	 * @async
	 * @param {number|string} id
	 * @returns object
	 */
	async fetch(id) {
		const data = await this.client.api.cosmetics(id);
		if (typeof id != "object" && !Array.isArray(id))
			this.cache.set(id, data);

		return data;
	}

	/**
	 * 
	 * @returns {Promise}
	 */
	buyHead() {
		return RequestHandler.post("store/buy", true);
	}

	/**
	 * 
	 * @param {Cosmetic|number|string} item
	 * @returns {Promise}
	 */
	setHead(item) {
		return RequestHandler.post("store/equip", {
			item_id: Number(item instanceof Cosmetic ? item.id : item)
		}, true);
	}
}