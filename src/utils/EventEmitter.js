export default class {
    #events = new Map();

    /**
     * 
     * @param {String} event event name
     * @param {Function} handler listening function
     */
    on(event, handler) {
        if (typeof event !== "string") {
            throw new TypeError("INVALID_EVENT");
        } else if (typeof handler !== "function") {
            throw new TypeError("Handler must be of type: Function.");
        }

        let events = this.#events.get(event) || [];
        events.push(handler.bind(this));

        this.#events.set(event, events);
        return this;
    }

    /**
     * 
     * @param {String} event event name
     * @param {Function} handler listening function
     */
    once(event, handler) {
        return this.on(event + " --once", handler);
    }

    /**
     * 
     * @emits
     * @param {String} event event name
     * @param  {...any} args arguments passed through to the listening function
     * @returns {any} function call
     */
    emit(event, ...args) {
        if (this.#events.has(event)) {
            this.#events.get(event).forEach(event => event(...args));
        }

        event = event + " --once";
        if (this.#events.has(event)) {
            this.#events.get(event).forEach(event => event(...args));
            this.#events.delete(event);
        }
    }
}