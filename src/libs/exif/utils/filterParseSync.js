import ParseFilter from "../ParseFilter.js";

export default function(inBuffer, bitmapInfo) {
    let filter = new ParseFilter(bitmapInfo);
    filter.filter(inBuffer);
    return filter.buffer
}