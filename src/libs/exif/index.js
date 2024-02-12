import process from "./utils/filterParseSync.js";
import Parser from "./Parser.js";
import dataToBitMap from "./utils/bitmapper.js";

export default function(buffer, options = {}) {
	let parser = new Parser(options);
	let metadata = parser.parse(buffer);
	let inflated = parser.inflated;
	if (!inflated || !inflated.length) {
		throw new Error("bad png - invalid inflate data response");
	}

	let unfilteredData = process(inflated, metadata);
	let bitmapData = dataToBitMap(unfilteredData, metadata);
	metadata.data = bitmapData;
	return metadata
}