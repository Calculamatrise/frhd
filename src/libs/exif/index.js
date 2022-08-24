import process from "./filter-parse-sync.js";
import Parser from "./parser.js";
import dataToBitMap from "./bitmapper.js";

export default function(buffer, options = {}) {
    let parser = new Parser(options);
    let metadata = parser.parse(buffer);
    let inflated = parser.inflated;
    if (!inflated || !inflated.length) {
        throw new Error("bad png - invalid inflate data response");
    }

    let unfilteredData = process(inflated, metadata);
    let bitmapData = dataToBitMap(unfilteredData, metadata);
    unfilteredData = null;

    metadata.data = bitmapData;

    return metadata;
}