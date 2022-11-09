import crypto from "crypto";

import RequestHandler from "../utils/RequestHandler.js";
import BaseManager from "./BaseManager.js";
import Race from "../structures/Race.js";
import getUser from "../getUser.js";

export default class extends BaseManager {
    /**
     * 
     * @async
     * @param {number|string} user
     * @returns {Race}
     */
    async fetch(user) {
        if (isNaN(user)) {
            user = await getUser(user).then(user => user.id);
        }

        if (!user) throw new Error("INVALID_USER");
        return RequestHandler.get(`/track_api/load_races?t_id=${this.client.id}&u_ids=${user}`).then((response) => {
            return response.data.map((race) => {
                race = new Race(race);
                this.push(race);
                return race;
            });
        });
    }

    /**
     * 
     * @private
     * @param {number|string} user 
     * @returns {object}
     */
    clone(user) {
        return this.fetch(user).then(res => this.post(res.race.code, res.race.vehicle, res.race.runTicks));
    }

    /**
     * 
     * @private
     * @param {number|string} user 
     * @param {object|string} code 
     * @param {number} ticks 
     * @param {string} vehicle 
     * @returns {object}
     */
    async post(user, code, ticks, vehicle = 'MTB') {
        if (isNaN(user)) {
            user = await getUser(user).then(user => user.id);
        }

        if (!user)
            throw new Error("INVALID_CLIENT");
        else if (!code)
            throw new Error("INVALID_RACE_DATA");
        else if (isNaN(ticks))
            throw new Error("INVALID_TIME");

        return RequestHandler.post("/track_api/track_run_complete", {
            t_id: this.client.id,
            u_id: user,
            code: typeof code == 'object' ? JSON.stringify(code) : code,
            vehicle,
            run_ticks: ticks,
            fps: 25,
            time: t2t(ticks),
            sig: crypto.createHash('sha256').update(`${this.client.id}|${user}|${code}|${ticks}|${vehicle}|25|erxrHHcksIHHksktt8933XhwlstTekz`).digest('hex')
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {number|string} user id or username
     * @returns {Promise}
     */
    async remove(user) {
        if (isNaN(user)) {
            user = await getUser(user).then(user => user.id);
        }

        if (!user) throw new Error("INVALID_USER");
        return RequestHandler.post("/moderator/remove_race", {
            t_id: this.client.id,
            u_id: user
        }, true);
    }
}

function t2t(ticks) {
    let t = parseInt(ticks / 30 * 1e3, 10);
    let e = Math.floor(t / 6e4);
    return e + ":" + String(((t - 6e4 * e) / 1e3).toFixed(2)).replace(/^0?(?=\d)/, '0');
}