export default class {
    #events = new Map();

    /**
     * 
     * @param {String} event event name
     * @param {Function} func listening function
     */
    on(event, func = function() {}) {
        if (event === void 0 || typeof event !== "string")
            return new Error("INVALID_EVENT");

        this.#events.set(event, func.bind(this));

        return this;
    }

    /**
     * 
     * @emits
     * @param {String} event event name
     * @param  {...any} args arguments passed through to the listening function
     * @returns {any} function call
     */
    emit(event, ...args) {
        if (event === void 0 || typeof event !== "string")
            return new Error("INVALID_EVENT_ID");

        event = this.#events.get(event);
        if (event === void 0 && typeof event !== "function")
            return new Error("INVALID_FUNCTION");

        return event(...args);
    }
}