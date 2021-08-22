import RequestHandler from "./utils/RequestHandler.js";

export default async function(page, callback = t => t) {
    return await RequestHandler.ajax(`/leaderboards/player/lifetime/${page}?ajax=!0`).then(callback);
}