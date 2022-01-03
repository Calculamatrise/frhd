import RequestHandler from "./utils/RequestHandler.js";

export default function(callback = response => response) {
    return RequestHandler.ajax("/?ajax=true").then(callback);
}