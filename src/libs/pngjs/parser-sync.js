import inflateSync from "./sync-inflate.js";
import SyncReader from "./sync-reader.js";
import process from "./filter-parse-sync.js";
import Parser from "./parser.js";
import dataToBitMap from "./bitmapper.js";

export default function(buffer, options = {}) {
    let metaData;
    function handleMetaData(data) {
        metaData = data;
    }

    let inflateDataList = [];
    function handleInflateData(inflatedData) {
        inflateDataList.push(inflatedData);
    }

    let reader = new SyncReader(buffer);
    let parser = new Parser(options, {
        read: reader.read.bind(reader),
        metadata: handleMetaData,
        inflateData: handleInflateData
    });

    parser.start();
    reader.process();

    //join together the inflate datas
    let inflatedData;
    let rowSize = ((metaData.width * metaData.bpp * metaData.depth + 7) >> 3) + 1;
    let imageSize = rowSize * metaData.height;
    inflatedData = inflateSync(Buffer.concat(inflateDataList), {
        chunkSize: imageSize,
        maxLength: imageSize,
    });

    if (!inflatedData || !inflatedData.length) {
        throw new Error("bad png - invalid inflate data response");
    }

    let unfilteredData = process(inflatedData, metaData);

    let bitmapData = dataToBitMap(unfilteredData, metaData);
    unfilteredData = null;

    metaData.data = bitmapData;

    return metaData;
}