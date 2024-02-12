export default class {
	#buffer = null;
	#queue = [];
	constructor(data) {
		this.#buffer = Buffer.from(data)
	}

	read(length, callback) {
		this.#queue.push(Object.defineProperties((...args) => callback(...args), {
			length: { value: Math.abs(length) },
			allowLess: { value: length < 0 }
		}))
	}

	process() {
		while(this.#queue.length > 0 && this.#buffer.length > 0) {
			let read = this.#queue.shift();
			if (this.#buffer.length < read.length && !read.allowLess) {
				break;
			}

			let data = this.#buffer.slice(0, read.length);
			this.#buffer = this.#buffer.slice(read.length);
			read(data)
		}

		if (this.#queue.length > 0) {
			throw new Error("There are some read requests waitng on finished stream");
		} else if (this.#buffer.length > 0) {
			throw new Error("unrecognised content at end of stream")
		}
	}
}