import EventEmitter from "events";
import read from "../libs/exif/index.js";

export default class Image extends EventEmitter {
	#src = null;
	width = 0;
	height = 0;
	get src() {
		return this.#src;
	}

	set src(value) {
		this.#src = value;
		fetch(value).then(r => {
			Object.defineProperty(this, 'type', { value: r.headers.get('content-type') });
			return r.arrayBuffer()
		}).then(arrayBuffer => {
			const { data, height, width } = read(arrayBuffer);
			Object.defineProperty(this, 'data', { value: data, writable: false });
			this.height = height;
			this.width = width;
			this.emit("load", this);
			typeof this.onload == "function" && this.onload.call(this);
		})
	}

	constructor(width, height) {
		super();
		width !== void 0 && (this.width = parseInt(width));
		height !== void 0 && (this.height = parseInt(height));
		Object.defineProperty(this, 'data', { value: null, writable: true })
	}

	/**
	 * Load an image asynchronous
	 * @param {string} url 
	 * @returns {Promise<Uint8ClampedArray>}
	 */
	static load(url) {
		const image = new this();
		return new Promise((resolve, reject) => {
			try {
				image.on("load", () => resolve(image));
				image.src = url;
			} catch(err) {
				reject(err);
			}
		})
	}
}