import RequestHandler from "./utils/RequestHandler.js";

export default function(page, callback = t => t) {
    return RequestHandler.ajax(`/leaderboards/author/lifetime/${page}?ajax=!0`).then(callback);
}