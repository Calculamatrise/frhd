import Client from "./utils/client.js";

export default async function(page, callback = t => t) {
    return await Client.ajax({
        path: `/leaderboards/player/lifetime/${page}?ajax=!0`,
        method: "get"
    }, callback);
}