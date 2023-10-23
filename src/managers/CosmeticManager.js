import BaseManager from "./BaseManager.js";
import RequestHandler from "../utils/RequestHandler.js";
import Cosmetic from "../structures/Cosmetic.js";

export default class extends BaseManager {
	/**
	 * 
	 * @async
	 * @param {number|string} id
	 * @returns {Promise<object>}
	 */
	async fetch(id, { force } = {}) {
		if (!force && this.cache.has(id)) {
			return this.cache.get(id);
		}

		const data = await this.client.api.cosmetics(id);
		for (const headGear in data.heads)
			this.cache.set(headGear.id, headGear);
		return data;
	}

	/**
	 * 
	 * @returns {Promise<Cosmetic>}
	 */
	buy() {
		return RequestHandler.post("store/buy", true).then(res => {
			let headGear = new Cosmetic(res.data.head_gear);
			this.cache.set(headGear.id, headGear);
			return headGear;
		});
	}

	/**
	 * 
	 * @param {Cosmetic|number|string} item
	 * @returns {Promise<Cosmetic>}
	 */
	equip(item) {
		item instanceof Object && (item = item.id);
		return RequestHandler.post("store/equip", {
			item_id: item
		}, true).then(() => this.cache.get(item));
	}
}