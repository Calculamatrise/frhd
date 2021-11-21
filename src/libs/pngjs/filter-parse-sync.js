import SyncReader from "./sync-reader.js";
import Filter from "./filter-parse.js";

export default function(inBuffer, bitmapInfo) {
    let outBuffers = [];
    let reader = new SyncReader(inBuffer);
    let filter = new Filter(bitmapInfo, {
        read: reader.read.bind(reader),
        write(bufferPart) {
            outBuffers.push(bufferPart);
        },
        complete() {},
    });

    filter.start();
    reader.process();

    return Buffer.concat(outBuffers);
}