import RequestHandler from "./utils/RequestHandler.js";

export default function(callback = t => t) {
    return RequestHandler.ajax("/?ajax=true").then(callback);
}