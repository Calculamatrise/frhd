import LimitedMap from "../utils/LimitedMap.js";

export default class {
	cache = new LimitedMap({ limit: 1e4 });
	constructor(client) {
		/**
		 * The client that instantiated this Manager
		 * @name BaseManager#client
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client })
	}
}