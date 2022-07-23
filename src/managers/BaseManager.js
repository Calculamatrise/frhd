import LimitedMap from "../utils/LimitedMap.js";

export default class {
    constructor(client) {
        /**
         * 
         * @readonly
         */
        this.client = client;
    }
    
    /**
     * 
     * @private
     */
    #cache = new LimitedMap({ limit: 1e4 });;
    get cache() {
        return this.#cache;
    }
}