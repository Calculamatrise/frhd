import Client from "./utils/client.js";

export default async function(callback = t => t) {
    return await Client.ajax({
        path: "/?ajax=true",
        method: "get"
    }, callback);
}