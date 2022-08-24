import LimitedMap from "../utils/LimitedMap.js";

export default class {
    #cache = new LimitedMap({ limit: 1e4 });
    get cache() {
        return this.#cache;
    }

    constructor(client) {
        /**
         * 
         * @readonly
         */
        this.client = client;
    }
}