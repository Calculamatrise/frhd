import Filter from "./filter-parse.js";

export default function(inBuffer, bitmapInfo) {
    let filter = new Filter(bitmapInfo);
    filter.filter(inBuffer);
    return filter.buffer;
}