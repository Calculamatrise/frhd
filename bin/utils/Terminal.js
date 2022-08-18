import { Interface } from "readline";
import TerminalResponse from "./TerminalResponse.js";

export default class extends Interface {
    constructor() {
        super({
            input: process.stdin,
            output: process.stdout
        });
    }
    #queries = new Map();
    /**
     * 
     * @param {String} event 
     * @param {Function} listener 
     */
    when(event, listener) {
        if (typeof event != "string") {
            throw new TypeError("Event must be of type: String");
        } else if (typeof listener != "function") {
            throw new TypeError("Listener must be of type: Function");
        }

        this.#queries.set(event, listener);
    }

    /** Connect to the terminal */
    connect() {
        const [ value, ...args ] = process.argv.slice(2);
        if (value !== void 0) {
            let callback = this.#queries.get(value.toLowerCase());
            if (typeof callback == "function") {
                callback.call(this, new TerminalResponse(this, args));
                return;
            }
        }

        console.log("Routes (type exit at any time to break the loop):\n\t- " + Array.from(this.#queries.keys()).join("\n> "));
        this.close();
    }
}