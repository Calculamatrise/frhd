import read from "../libs/exif/index.js";

import EventEmitter from "events";
import RequestHandler from "./RequestHandler.js";

export default class Image extends EventEmitter {
    #data = null;
    #src = null;
    width = 0;
    height = 0;
    get data() {
        return this.#data;
    }

    get src() {
        return this.#src;
    }

    set src(value) {
        this.#src = value;
        RequestHandler.ajax({
            url: value,
            headers: {
                "Content-Type": "image/png"
            }
        }).then(image => {
            const { width, height, data } = read(image);

            this.width = width;
            this.height = height;
            this.#data = new Uint8ClampedArray(data);

            this.emit("load", this);
            if (typeof this.onload == "function") {
                this.onload.call(this);
            }
        });
    }

    /**
     * Load an image asynchronous
     * @param {string} url 
     * @returns {Promise<Uint8ClampedArray>}
     */
    static load(url) {
        const image = new this.constructor();
        return new Promise(function(resolve, reject) {
            try {
                image.on("load", function() {
                    resolve(this.data);
                });
                image.src = url;
            } catch(err) {
                reject(err);
            }
        });
    }

    constructor(width, height) {
        super();
        if (width !== void 0) {
            this.width = parseInt(width);
        }

        if (height !== void 0) {
            this.height = parseInt(height);
        }
    }
}