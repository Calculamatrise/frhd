import EventEmitter from "events";
import { inflateSync } from "zlib";

import constants from "./constants.js";
import SyncReader from "./sync-reader.js";

export default class extends EventEmitter {
    #buffers = [];
    #chunks = {
        [constants.TYPE_IHDR]: this.#handleIHDR.bind(this),
        [constants.TYPE_IEND]: this.#handleIEND.bind(this),
        [constants.TYPE_IDAT]: this.#handleIDAT.bind(this)
    }

    #colorType = 0;
    #hasIEND = false;
    #hasIHDR = false;
    #options = {};
    #reader = null;

    metadata = {
        width: 0,
        height: 0,
        depth: 0,
        bpp: 0
    }

    get buffer() {
        return Buffer.concat(this.#buffers);
    }

    get inflated() {
        return inflateSync(this.buffer);
    }

	constructor(options) {
        super();

        for (const key in options) {
            switch(key) {
                case 'checkCRC': {
                    this.#options.checkCRC = Boolean(options[key]);
                }
            }
        }
	}

	parse(buffer) {
        this.#reader = new SyncReader(buffer);
		this.#reader.read(constants.PNG_SIGNATURE.length, this.#parseSignature.bind(this));
        this.#reader.process();
        return this.metadata;
	}

	#parseSignature(data) {
		let signature = constants.PNG_SIGNATURE;
		for (let i = 0; i < signature.length; i++) {
			if (data[i] !== signature[i]) {
				throw new Error("Invalid file signature");
			}
		}

		this.#reader.read(8, this.#parseChunk.bind(this));
	}

	#parseChunk(data) {
		let length = data.readUInt32BE(0);
		let type = data.readUInt32BE(4);
		let name = "";
		for (let i = 4; i < 8; i++) {
			name += String.fromCharCode(data[i]);
		}

		// console.log('chunk ', name, length);
		// chunk flags
		let ancillary = Boolean(data[4] & 0x20); // or critical
		//    priv = Boolean(data[5] & 0x20), // or public
		//    safeToCopy = Boolean(data[7] & 0x20); // or unsafe

		if (!this.#hasIHDR && type !== constants.TYPE_IHDR) {
			throw new Error("Expected IHDR on beggining");
		}

		if (this.#chunks[type]) {
			return this.#chunks[type](length);
		}

		if (!ancillary) {
			throw new Error("Unsupported critical chunk type " + name);
		}

		this.#reader.read(length + 4, this.#skipChunk.bind(this));
	}

	#skipChunk(/*data*/) {
		this.#reader.read(8, this.#parseChunk.bind(this));
	}

	#handleChunkEnd() {
		this.#reader.read(4, (/*data*/) => {
            if (!this.#hasIEND) {
                this.#reader.read(8, this.#parseChunk.bind(this));
            }
        });
	}

	#handleIHDR(length) {
		this.#reader.read(length, data => {
            let depth = data[8];
            if (
                depth !== 8 &&
                depth !== 4 &&
                depth !== 2 &&
                depth !== 1 &&
                depth !== 16
            ) {
                throw new Error("Unsupported bit depth " + depth);
            }

            let colorType = data[9]; // bits: 1 palette, 2 color, 4 alpha
            if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
                throw new TypeError("Unsupported color type");
            }

            this.#colorType = colorType;
            this.#hasIHDR = true;
            this.metadata = {
                width: data.readUInt32BE(0),
                height: data.readUInt32BE(4),
                depth: depth,
                bpp: constants.COLORTYPE_TO_BPP_MAP[this.#colorType]
            }
            this.#handleChunkEnd();
        });
	}

	#handleIDAT(length) {
		this.#reader.read(-length, data => {
            this.#buffers.push(data);
            this.emit("headers", data);
            let leftOverLength = length - data.length;
            if (leftOverLength > 0) {
                this.#handleIDAT(leftOverLength);
            } else {
                this.#handleChunkEnd();
            }
        });
	}

	#handleIEND(length) {
		this.#reader.read(length, () => {
            this.#hasIEND = true;
		    this.#handleChunkEnd();
        });
	}
}