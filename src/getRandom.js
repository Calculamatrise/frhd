import Client from "./utils/client.js";

export default async function(callback = t => t) {
    return await Client.ajax({
        path: `/random/track/?ajax=!0`,
        method: "get"
    }, callback);
}