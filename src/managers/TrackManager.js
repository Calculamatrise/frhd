import { token } from "../client/Client.js";

import BaseManager from "./BaseManager.js";
import Builder from "../utils/Builder.js";

import getCategory from "../getCategory.js";

export default class extends BaseManager {
    /**
     * 
     * @returns {Builder} instance of Builder
     */
    create() {
        return new Builder();
    }

    /**
     * 
     * @async
     * @param {number|string} id
     * @returns object
     */
    async fetch(id) {
        const data = await this.client.api.tracks(id);
        
        this.cache.set(id, data);

        return data;
    }

    /**
     * 
     * @async
     * @private
     * @param {object} options
     * @description rates all tracks between
     * @returns string
     */
    async rateAll(rating, { startingTrackId = 1001, endingTrackId, timeout = 0 } = {}) {
        if (!token) {
            throw new Error("INVALID_TOKEN");
        }

        if (!endingTrackId) {
            endingTrackId = await getCategory("recently-added").then(function(response) {
                return parseInt(response.tracks[0].slug);
            });
        }
    
        for (let trackId = startingTrackId; trackId < endingTrackId; trackId++) {
            await this.client.tracks.fetch(trackId).then(function(track) {
                return track.vote(1).catch(error => {
                    console.warn(error);
                    
                    return track.vote(rating);
                });
            }).then(function(response) {
                return console.log(trackId, response.result || response.msg);
            }).catch(console.error);

            timeout && await new Promise(resolve => setTimeout(resolve, timeout));
        }

        return "No more love left to spread!";
    }
}