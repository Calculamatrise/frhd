import constants from "./constants.js";
import CrcCalculator from "./crc.js";

export default class {
	constructor(options, dependencies) {
		this._options = options;
		options.checkCRC = options.checkCRC !== false;

		this._hasIHDR = false;
		this._hasIEND = false;
		this._emittedHeadersFinished = false;

		// input flags/metadata
		this._colorType = 0;

		this._chunks = {};
		this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
		this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
		this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);

		this.read = dependencies.read;
		this.metadata = dependencies.metadata;
		this.inflateData = dependencies.inflateData;
		this.headersFinished = dependencies.headersFinished || function () { };
	}

	start() {
		this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
	}

	_parseSignature(data) {
		let signature = constants.PNG_SIGNATURE;
		for (let i = 0; i < signature.length; i++) {
			if (data[i] !== signature[i]) {
				throw new Error("Invalid file signature");
			}
		}

		this.read(8, this._parseChunkBegin.bind(this));
	}

	_parseChunkBegin(data) {
		// chunk content length
		let length = data.readUInt32BE(0);
	
		// chunk type
		let type = data.readUInt32BE(4);
		let name = "";
		for (let i = 4; i < 8; i++) {
			name += String.fromCharCode(data[i]);
		}
	
		//console.log('chunk ', name, length);
	
		// chunk flags
		let ancillary = Boolean(data[4] & 0x20); // or critical
		//    priv = Boolean(data[5] & 0x20), // or public
		//    safeToCopy = Boolean(data[7] & 0x20); // or unsafe
	
		if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
			throw new Error("Expected IHDR on beggining");
		}
	
		this._crc = new CrcCalculator();
		this._crc.write(Buffer.from(name));
	
		if (this._chunks[type]) {
			return this._chunks[type](length);
		}
	
		if (!ancillary) {
			throw new Error("Unsupported critical chunk type " + name);
		}
	
		this.read(length + 4, this._skipChunk.bind(this));
	}

	_skipChunk(/*data*/) {
		this.read(8, this._parseChunkBegin.bind(this));
	}

	_handleChunkEnd() {
		this.read(4, this._parseChunkEnd.bind(this));
	}

	_parseChunkEnd(data) {
		let fileCrc = data.readInt32BE(0);
		let calcCrc = this._crc.crc32();
	
		// check CRC
		if (this._options.checkCRC && calcCrc !== fileCrc) {
			throw new Error("Crc error - " + fileCrc + " - " + calcCrc);
		}
	
		if (!this._hasIEND) {
			this.read(8, this._parseChunkBegin.bind(this));
		}
	}

	_handleIHDR(length) {
		this.read(length, this._parseIHDR.bind(this));
	}

	_parseIHDR(data) {
		this._crc.write(data);
	
		let width = data.readUInt32BE(0);
		let height = data.readUInt32BE(4);
		let depth = data[8];
		let colorType = data[9]; // bits: 1 palette, 2 color, 4 alpha
	
		if (
			depth !== 8 &&
			depth !== 4 &&
			depth !== 2 &&
			depth !== 1 &&
			depth !== 16
		) {
			throw new Error("Unsupported bit depth " + depth);
		}
		if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
			throw new Error("Unsupported color type");
		}
	
		this._colorType = colorType;
	
		let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
	
		this._hasIHDR = true;
	
		this.metadata({
			width: width,
			height: height,
			depth: depth,
			bpp: bpp
		});
	
		this._handleChunkEnd();
	}

	_handleIDAT(length) {
		if (!this._emittedHeadersFinished) {
			this._emittedHeadersFinished = true;
			this.headersFinished();
		}
		this.read(-length, this._parseIDAT.bind(this, length));
	}

	_parseIDAT(length, data) {
		this._crc.write(data);
	
		this.inflateData(data);
		let leftOverLength = length - data.length;
	
		if (leftOverLength > 0) {
			this._handleIDAT(leftOverLength);
		} else {
			this._handleChunkEnd();
		}
	}

	_handleIEND(length) {
		this.read(length, this._parseIEND.bind(this));
	}

	_parseIEND(data) {
		this._crc.write(data);
	
		this._hasIEND = true;
		this._handleChunkEnd();
	
		if (this.finished) {
			this.finished();
		}
	}
}