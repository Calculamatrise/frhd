import { token } from "../client/Client.js";

import RequestHandler from "../utils/RequestHandler.js";
import User from "../structures/User.js";
import getUser from "../getUser.js";

export default class extends Array {
    get(user) {
        if (isNaN(+(+user).toFixed()))
            throw new Error("INVALID_USER");

        return this.find(race => +(race.userId || race.user.id) === +user) || null;
    }

    /**
     * 
     * @async
     * @param {Number|String} user
     * @returns {Object}
     */
    async fetch(user) {
        isNaN(+(+user).toFixed()) && (user = await getUser(user).then(user => user.id));

        if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax(`/track_api/load_races?t_id=${this.track}&u_ids=${user}&ajax=true`).then((response) => {
            return response.data.map((race) => {
                race = new Race(race);

                this.push(race);

                return race;
            });
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} user 
     * @returns {Promise}
     */
    async remove(user) {
        isNaN(+(+user).toFixed()) && (user = await getUser(user).then(user => user.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/remove_race",
            body: {
                t_id: this.track,
                u_id: user,
                app_signed_request: token
            },
            method: "post"
        });
    }
}