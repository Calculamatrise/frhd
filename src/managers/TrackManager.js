import RequestHandler from "../utils/RequestHandler.js";

import { token } from "../client/Client.js";

import BaseManager from "./BaseManager.js";
import Builder from "../utils/Builder.js";

import getCategory from "../getCategory.js";

/**
 * @callback Callback
 */

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
     * @param {Object} options 
     * @param {String} options.title 
     * @param {String} options.description 
     * @param {String} options.code 
     * @param {String} options.defaultVehicle 
     * @param {Boolean} options.MTB 
     * @param {Boolean} options.BMX 
     * @param {Callback} callback 
     * @returns {Promise}
     */
    async post({
        title = "Untitled",
        description = "No description provided.",
        code,
        defaultVehicle = "MTB",
        MTB = !0,
        BMX = !0
    }) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (code === void 0) {
            throw new Error("INVALID_TRACK");
        }

        return RequestHandler.ajax({
            path: "/create/submit",
            body: {
                name: title,
                desc: description,
                default_vehicle: defaultVehicle,
                "allowed_vehicles[MTB]": MTB,
                "allowed_vehicles[BMX]": BMX,
                code,
                app_signed_request: token
            },
            method: "post"
        }).then((response) => {
            if (response.result === false) {
                throw new Error(response.msg);
            }

            return response;
        });
    }

    /**
     * 
     * @async
     * @param {Number|String} id track ID
     * @returns {Object}
     */
    async fetch(id) {
        const data = await this.client.api.tracks(id);
        
        this.cache.set(id, data);

        return data;
    }

    /**
     * 
     * @async
     * @protected requires administrative privileges.
     * @description add a track to the 'track of the day' queue
     * @param {Number|String} track
     * @param {Number|String} lives
     * @param {Number|String} refillCost
     * @param {Number|String} gems
     * @param {Callback} callback
     * @returns {Promise}
     */
    addTrackOfTheDay(track, lives, refillCost, gems) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/add_track_of_the_day",
            body: {
                t_id: track,
                lives,
                rfll_cst: refillCost,
                gems,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @async
     * @protected requires administrative privileges.
     * @description removes a specified track from the track of the day queue.
     * @param {Number|String} track
     * @param {Callback} callback
     * @returns {Promise}
     */
    async removeTrackOfTheDay(track, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/removeTrackOfTheDay",
            body: {
                t_id: track,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} id track ID
     * @returns {Promise}
     */
    feature(id) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax(`/track_api/feature_track/${parseInt(id)}/1?ajax=!0&app_signed_request=${token}&t_1=ref&t_2=desk`);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} id track ID
     * @param {Callback} callback 
     * @returns {Promise}
     */
    unfeature(id) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax(`/track_api/feature_track/${parseInt(id)}/0?ajax=!0&app_signed_request=${token}&t_1=ref&t_2=desk`);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @description hide a track
     * @param {Number|String} id track ID
     * @returns {Promise}
     */
    hide(id) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax(`/moderator/hide_track/${parseInt(id)}?ajax=!0&app_signed_request=${token}&t_1=ref&t_2=desk`);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @description hide a track
     * @param {Number|String} id track ID
     * @returns {Promise}
     */
    hideAsAdmin(id) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/hide_track",
            body: {
                track_id: parseInt(id),
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @async
     * @private
     * @description rate all tracks between so and so.
     * @param {Number|Boolean} rating
     * @param {Object} options
     * @param {Number|String} options.startingTrackId 
     * @param {Number|String} options.endingTrackId 
     * @param {Number|String} options.timeout 
     * @returns {String}
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
            await this.fetch(trackId).then(function(track) {
                return track.vote(1);
            }).then(function(response) {
                return console.log(trackId, response.result || response.msg);
            }).catch(console.error);

            timeout && await new Promise(resolve => setTimeout(resolve, timeout));
        }

        return "No more love left to spread!";
    }

    /**
     * 
     * @async
     * @protected requires administrative privileges.
     * @param {Object} options 
     * @param {Array} options.users 
     * @param {Number|String} options.startingTrackId 
     * @param {Number|String} options.endingTrackId 
     * @param {Number|String} timeout 
     * @description removes cheated ghosts on all tracks between the given range
     * @returns {String} 
     */
    async deepClean({ users, startingTrackId = 1001, endingTrackId, timeout = 0 } = {}, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        if (!endingTrackId)
            endingTrackId = await getCategory("recently-added").then(function(response) {
                return parseInt(response.tracks[0].slug);
            });
        
        users = await Promise.all(users.map(async user => {
            if (user.match(/\D+/gi)) {
                user = await this.users.fetch(user);
                if (!user)
                    throw new Error("INVALID_USER");

                return user.id;
            }

            return parseInt(user);
        }));

        for (let trackId = startingTrackId; trackId <= endingTrackId; trackId++) {
            await this.fetch(trackId).then(async function(track) {
                if (users) {
                    for (const userId of users) {
                        track.races.remove(userId).catch(response => {
                            console.warn(response);

                            return track.races.remove(userId);
                        });
                    }
                } else {
                    await track.getLeaderboard().then(leaderboard => {
                        for (const race of leaderboard) {
                            if (race && typeof race.runTime !== "undefined" && !race.runTime) {
                                track.races.remove(race.userId || race.user.id);
                            }
                        }
                    });
                }

                return track.id;
            }).then(callback);
            
            timeout && await new Promise(resolve => setTimeout(resolve, timeout));
        }

        return "No more cheaters left to exterminate!";
    }
}