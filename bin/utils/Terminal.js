import { Interface } from "readline";
import TerminalResponse from "./TerminalResponse.js";

export default class extends Interface {
    #queries = new Map();
    constructor() {
        super({
            input: process.stdin,
            output: process.stdout
        });
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

        console.log("Routes (type exit at any time to break the loop):\n  > " + Array.from(this.#queries.keys()).join("\n  > "));
        this.close();
    }

    /**
     * Style text
     * @param {String} text
     * @param {Object} [options]
     * @param {String} [options.color]
     * @param {String} [options.background]
     * @param {String} [options.foreground]
     * @param {Boolean} [options.reset]
     * @param {Boolean} [options.bold]
     * @param {Boolean} [options.italic]
     * @param {Boolean} [options.underline]
     * @param {Boolean} [options.strikethrough]
     * @param {Boolean} [options.crossedout]
     * @param {Boolean} [options.hidden]
     * @param {Boolean} [options.dim]
     * @param {Boolean} [options.overline]
     * @param {Boolean} [options.blink]
     * @param {Boolean} [options.inverse]
     * @param {Boolean} [options.doubleunderline]
     * @param {Boolean} [options.framed]
     * @param {Array<String>} options.modifiers[]
     * @param {Boolean} options.modifiers[].bold
     * @returns {String}
     */
    print(text, options) {
        if (arguments.length > 2) {
            for (let argument = 0; argument < arguments.length; argument++) {
                this.print(arguments[argument], typeof arguments[argument + 1] == 'object' && arguments[++argument]);
                this.write(' ');
            }
            return void this.write('\n');
        }

        if (typeof text == 'object' && text !== null) {
            text = JSON.stringify(text, null);
        }

        let filters = new Set();
        if (typeof options == "object") {
            for (const key in options) {
                if (typeof options[key] == "string") {
                    let filter = inspect.colors[options[key].toLowerCase()];
                    if (filter !== void 0) {
                        switch(key.toLowerCase()) {
                            case "background": {
                                filters.add(10 + filter.at(0));
                                break;
                            }

                            case "color":
                            case "foreground": {
                                filters.add(filter.at(0));
                                break;
                            }
                        }
                    }
                } else {
                    switch(key.toLowerCase()) {
                        case "reset":
                        case "bold":
                        case "italic":
                        case "underline":
                        case "strikethrough":
                        case "crossedout":
                        case "hidden":
                        case "dim":
                        case "overline":
                        case "blink":
                        case "inverse":
                        case "doubleunderline":
                        case "framed": {
                            let filter = inspect.colors[key.toLowerCase()];
                            if (filter !== void 0) {
                                filters.add(filter.at(1 - options[key]));
                            }
                        }

                        case "modifiers": {
                            if (typeof options[key] == "object") {
                                for (const mod of options[key]) {
                                    let filter = inspect.colors[mod];
                                    if (filter !== void 0) {
                                        filters.add(filter.at(0));
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }

        if (filters.size === 0) {
            return void this.write(`${text}`);
        }

        this.write(`\x1b[${Array.from(filters.values()).map(filter => `${filter}m`).join('\x1b[')}${text}\x1b[0m`);
    }

    /**
     * Handle a response from the user
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
}