import LimitedMap from "../utils/LimitedMap.js";

export default class {
    constructor(client) {
        /**
         * @readonly
         */
        this.client = client;
    }
    #cache = new LimitedMap({ limit: 10000 });;
    get cache() {
        return this.#cache;
    }
}