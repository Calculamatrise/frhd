let src;
let data;

import { PNG } from "pngjs";

import RequestHandler from "./RequestHandler.js";

const events = {}

export default class {
    constructor(width, height) {
        if (width !== void 0) {
            this.width = width;
        }

        if (height !== void 0) {
            this.height = height;
        }
    }

    width = 0;
    height = 0;

    /**
     * 
     * @public
     */
    get src() {
        return src;
    }
    /**
     * 
     * @type {String}
     */
    set src(source) {
        src = source;

        const response = RequestHandler.ajax(source, {
            headers: {
                "content-type": "image/png"
            }
        });

        const then = (image) => {
            image = PNG.sync.read(image);

            this.width = image.width;
            this.height = image.height;

            data = new Uint8ClampedArray(image.data);

            if (events.hasOwnProperty("load")) {
                events.load.bind(this)(this);
            }
            
            if (this.onload === "function") {
                this.onload.bind(this)(this);
            }
        }

        if (Buffer.isBuffer(response)) {
            then(response);

            return;
        }

        response.then(then);
    }

    /**
     * 
     * @protected
     * @type {Object}
     */
    get data() {
        return data;
    }

    /**
     * 
     * @param {String} event event
     * @param {Function} listener listener function
     */
    addEventListener(event, listener = function() {}) {
        if (typeof event !== "string") {
            throw new Error("Invalid event");
        } else if (typeof listener !== "function") {
            throw new Error("Invalid listener");
        }

        events[event] = listener;
    }

    on = this.addEventListener;
}