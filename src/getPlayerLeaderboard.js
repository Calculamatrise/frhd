import RequestHandler from "./utils/RequestHandler.js";

export default function(page, callback = response => response) {
    return RequestHandler.ajax(`/leaderboards/player/lifetime/${page}?ajax=!0`).then(callback);
}