import crypto from "crypto";

import { token } from "../client/Client.js";

import RequestHandler from "../utils/RequestHandler.js";
import Race from "../structures/Race.js";
import getUser from "../getUser.js";

export default class extends Array {
    track = null;
    /**
     * 
     * @private
     * @param {Number|String} user 
     * @param {Object|String} code 
     * @param {String} vehicle 
     * @param {Number} ticks 
     * @returns {Object}
     */
    async post(user, code, vehicle = "MTB", ticks) {
        isNaN(+(+user).toFixed()) && (user = await getUser(user).then(user => user.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_CLIENT");
        else if (!code)
            throw new Error("INVALID_RACE_DATA");
        else if (isNaN(+ticks))
            throw new Error("INVALID_TIME");
        
        if (typeof code == "object")
            code = JSON.stringify(code);

        return RequestHandler.ajax({
            path: "/track_api/track_run_complete",
            body: {
                t_id: this.track,
                u_id: user,
                code: code,
                vehicle,
                run_ticks: ticks,
                fps: 25,
                time: t2t(ticks),
                sig: crypto.createHash('sha256').update(`${this.track}|${user}|${code}|${ticks}|${vehicle}|25|erxrHHcksIHHksktt8933XhwlstTekz`).digest('hex'),
                app_signed_request: token,
                t_1: "ref",
                t_2: "desk"
            },
            method: "post"
        });
    }

    /**
     * 
     * @private
     * @param {Number|String} user 
     * @returns {Object}
     */
    async clone(user) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return this.fetch(user).then(response => this.post(response.race.code, response.race.vehicle, response.race.runTicks));
    }

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

function t2t(ticks) {
    let t = ticks / 30 * 1e3;
    t = parseInt(t, 10);
    let e = Math.floor(t / 6e4)
        , i = (t - 6e4 * e) / 1e3;
    return i = i.toFixed(2),
        10 > e && (e = e),
        10 > i && (i = "0" + i),
        e + ":" + i
}