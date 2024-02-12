import EventEmitter from "events";

import paethPredictor from "./utils/predictPath.js";
import SyncReader from "./SyncReader.js";

export default class extends EventEmitter {
	#buffers = [];
	#images = [];
	#imageIndex = 0;
	#lastLine = null;
	#reader = null;
	#xref = 0;

	get buffer() {
		return Buffer.concat(this.#buffers);
	}

	/**
	 * 
	 * @param {Object} bitmapInfo
	 * @param {Number} bitmapInfo.width
	 * @param {Number} bitmapInfo.height
	 * @param {Number} bitmapInfo.depth
	 * @param {Number} bitmapInfo.bpp
	 */
	constructor(bitmapInfo) {
		super();
		let bpp = bitmapInfo.bpp;
		let depth = bitmapInfo.depth;
		this.#images.push({
			byteWidth: getByteWidth(bitmapInfo.width, bpp, depth),
			height: bitmapInfo.height,
			lineIndex: 0,
		});
		// when filtering the line we look at the pixel to the left
		// the spec also says it is done on a byte level regardless of the number of pixels
		// so if the depth is byte compatible (8 or 16) we subtract the bpp in order to compare back
		// a pixel rather than just a different byte part. However if we are sub byte, we ignore.
		if (depth === 8) {
			this.#xref = bpp;
		} else if (depth === 16) {
			this.#xref = bpp * 2;
		} else {
			this.#xref = 1
		}
	}

	/**
	 * 
	 * @param {Buffer} [buffer]
	 */
	filter(buffer) {
		this.#reader = new SyncReader(buffer);
		this.#reader.read(
			this.#images[this.#imageIndex].byteWidth + 1,
			this.#reverseFilterLine.bind(this)
		);
		this.#reader.process();
		return this.buffer
	}

	#unFilterType1(rawData, unfilteredLine, byteWidth) {
		let xComparison = this.#xref;
		let xBiggerThan = xComparison - 1;
		for (let x = 0; x < byteWidth; x++) {
			let rawByte = rawData[1 + x];
			let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
			unfilteredLine[x] = rawByte + f1Left;
		}
	}

	#unFilterType2(rawData, unfilteredLine, byteWidth) {
		let lastLine = this.#lastLine;
		for (let x = 0; x < byteWidth; x++) {
			let rawByte = rawData[1 + x];
			let f2Up = lastLine ? lastLine[x] : 0;
			unfilteredLine[x] = rawByte + f2Up;
		}
	}

	#unFilterType3(rawData, unfilteredLine, byteWidth) {
		let xComparison = this.#xref;
		let xBiggerThan = xComparison - 1;
		let lastLine = this.#lastLine;
	
		for (let x = 0; x < byteWidth; x++) {
			let rawByte = rawData[1 + x];
			let f3Up = lastLine ? lastLine[x] : 0;
			let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
			let f3Add = Math.floor((f3Left + f3Up) / 2);
			unfilteredLine[x] = rawByte + f3Add;
		}
	}

	#unFilterType4(rawData, unfilteredLine, byteWidth) {
		let xComparison = this.#xref;
		let xBiggerThan = xComparison - 1;
		let lastLine = this.#lastLine;

		for (let x = 0; x < byteWidth; x++) {
			let rawByte = rawData[1 + x];
			let f4Up = lastLine ? lastLine[x] : 0;
			let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
			let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
			let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
			unfilteredLine[x] = rawByte + f4Add;
		}
	}

	#reverseFilterLine(rawData) {
		let filter = rawData[0];
		let unfilteredLine;
		let currentImage = this.#images[this.#imageIndex];
		let byteWidth = currentImage.byteWidth;
		if (filter === 0) {
			unfilteredLine = rawData.slice(1, byteWidth + 1);
		} else {
			unfilteredLine = Buffer.alloc(byteWidth);
			switch(filter) {
			case 1:
				this.#unFilterType1(rawData, unfilteredLine, byteWidth);
				break;
			case 2:
				this.#unFilterType2(rawData, unfilteredLine, byteWidth);
				break;
			case 3:
				this.#unFilterType3(rawData, unfilteredLine, byteWidth);
				break;
			case 4:
				this.#unFilterType4(rawData, unfilteredLine, byteWidth);
				break;
			default:
				throw new Error("Unrecognised filter type - " + filter);
			}
		}

		this.#buffers.push(unfilteredLine);

		currentImage.lineIndex++;
		if (currentImage.lineIndex >= currentImage.height) {
			this.#lastLine = null;
			currentImage = this.#images[++this.#imageIndex];
		} else {
			this.#lastLine = unfilteredLine;
		}

		if (currentImage) {
			// read, using the byte width that may be from the new current image
			this.#reader.read(currentImage.byteWidth + 1, this.#reverseFilterLine.bind(this));
		} else {
			this.#lastLine = null;
			this.emit("complete")
		}
	}
}

function getByteWidth(width, bpp, depth) {
	let byteWidth = width * bpp;
	if (depth !== 8) {
		byteWidth = Math.ceil(byteWidth / (8 / depth));
	}

	return byteWidth
}