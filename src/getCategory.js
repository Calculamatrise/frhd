import RequestHandler from "./utils/RequestHandler.js";

export default function(category, callback = response => response) {
    return RequestHandler.ajax(`/${category}`).then(callback);
}