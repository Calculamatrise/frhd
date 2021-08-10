import Comment from "./comment.js";

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
}