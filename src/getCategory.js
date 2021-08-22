import RequestHandler from "./utils/RequestHandler.js";

export default function(category, callback = t => t) {
    return RequestHandler.ajax(`/${category}?ajax=!0`).then(callback);
}