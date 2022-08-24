export default class {
    #buffer = null;
    #reads = [];
	constructor(buffer) {
        this.#buffer = buffer;
	}

	read(length, callback) {
		this.#reads.push({
			length: Math.abs(length),
			allowLess: length < 0,
			func: callback
		});
	}

	process() {
		while(this.#reads.length > 0 && this.#buffer.length) {
			let read = this.#reads[0];
			if (this.#buffer.length && (this.#buffer.length >= read.length || read.allowLess)) {
				this.#reads.shift();
                let buf = this.#buffer;
				this.#buffer = buf.slice(read.length);
                read.func.call(this, buf.slice(0, read.length));
            } else {
				break;
			}
		}

		if (this.#reads.length > 0) {
			throw new Error("There are some read requests waitng on finished stream");
		}

		if (this.#buffer.length > 0) {
			throw new Error("unrecognised content at end of stream");
		}
	}
}