import Client from "./client.js";
import Comment from "./comment.js";
import Response from "./response.js";
import Race from "./race.js";

export default class {
    constructor(data) {
        if (!data || typeof data !== "object") throw new Error("INVALID_DATA_TYPE");
        this.id = null,
        this.title = null,
        this.description = null,
        this.slug = null,
        this.author = null,
        this.cdn = null,
        this.thumbnail = null,
        this.size = null,
        this.vehicle = null,
        this.vehicles = null,
        this.uploadDate = null,
        this.uploadDateAgo = null,
        this.featured = false,
        this.hidden = null,
        this.stats = null,
        this.comments = null,
        this.isCampaign = false,
        this.daily = null,
        this.gameSettings = null,
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "track":
                    this.id = data[t].id,
                    this.title = data[t].title,
                    this.description = data[t].descr,
                    this.slug = data[t].slug,
                    this.author = {
                        id: data[t].u_id,
                        username: data[t].author,
                        displayName: data[t].author_slug,
                        avatar: data[t].author_img_small
                    },
                    this.vehicle = data[t].vehicle,
                    this.cdn = data[t].cdn,
                    this.uploadDate = data[t].date,
                    this.thumbnail = data[t].img,
                    this.size = data[t].kb_size,
                    this.vehicles = data[t].vehicles,
                    this.uploadDateAgo = data[t].date_ago,
                    this.featured = data[t].featured,
                    this.hidden = data[t].hide;
                break;

                case "track_stats":
                    this.stats = {
                        likes: data[t].up_votes,
                        dislikes: data[t].dwn_votes,
                        votes: data[t].votes,
                        likesAverage: data[t].vote_percent,
                        plays: data[t].plays,
                        runs: data[t].runs,
                        firstRuns: data[t].frst_runs,
                        averageTime: data[t].avg_time,
                        completionRate: data[t].cmpltn_rate
                    }
                break;

                case "track_comments":
                    data[t].forEach(t => t.track = { id: this.id });
                    this.comments = data[t].map(t => new Comment(t));
                break;

                case "campaign":
                    this.isCampaign = data[t];
                break;

                case "totd":
                    this.daily = {
                        gems: data[t].gems,
                        lives: data[t].lives,
                        refillCost: data[t].refill_cost,
                        entries: data[t].entries
                    }
                break;

                case "game_settings":
                    this.gameSettings = data[t];
                break;
            }
        }
    }
    async getLeaderboard() {
        return await Client.ajax({
            path: "/track_api/load_leaderboard",
            body: {
                t_id: this.id,
                app_signed_request: token
            },
            method: "post"
        });
    }
    async getComment(commentId) {
        for (const t of this.comments) {
            if (t.id == commentId) {
                return t;
            }
        }
        return null;
    }
    async postComment(message) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!message) throw new Error("INVALID_MESSAGE");
        return await Client.ajax({
            path: "/track_comments/post",
            body: {
                t_id: this.id,
                msg: message.toString().replace(/\s+/g, "+"),
                app_signed_request: token
            },
            method: "post"
        }).then(async t => t.result ? new Comment(t.data.track_comments[0]) : new Error(t.msg));
    }
    async deleteComment(commentId) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.getComment(commentId).then(t => t.delete());
    }
    async sendChallenge(message, users) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!message || typeof message !== "string") throw new Error("INVALID_MESSAGE");
        if (!users || typeof users !== "object") throw new Error("INVALID_USERS");
        return await Client.ajax({
            path: "/challenge/send",
            body: {
                "users%5B%5D": users.join("&users%5B%5D="),
                msg: message,
                track_slug: this.id,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async vote(vote) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!vote || isNaN(vote)) throw new Error("INVALID_VOTE");
        return await Client.ajax({
            path: "/track_api/vote",
            body: {
                t_id: this.id,
                vote,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async getRace(username) {
        return await Client.ajax({
            path: `/t/${this.id}/r/${username}?ajax=true`,
            method: "get"
        }).then(t => new Race(t.race_leaderboard[0], t.game_settings.raceData[0]));
    }
    async removeRace(user) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await Client.ajax({
            path: "/moderator/remove_race",
            body: {
                t_id: this.id,
                u_id: user || this.user.id,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async addDaily(lives, refillCost, gems) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: "/moderator/add_track_of_the_day",
            body: {
                t_id: this.id,
                lives,
                rfll_cst: refillCost,
                gems,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async hide() {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: `/moderator/hide_track/${this.id}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`,
            method: "get"
        }).then(t => new Response(t));;
    }
}