import RequestHandler from "./utils/RequestHandler.js";

export default async function(callback = t => t) {
    return await RequestHandler.ajax("/?ajax=true").then(callback);
}