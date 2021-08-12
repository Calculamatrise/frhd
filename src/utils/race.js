export default class {
    constructor(data) {
        if (!data || typeof data !== "object") throw new Error("INVALID_DATA_TYPE");
        this.race = null,
        this.user = null,
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "race":
                    this.race = {
                        code: JSON.parse(data[t].code),
                        vehicle: data[t].vehicle,
                        desktop: data[t].desktop,
                        runTicks: data[t].run_ticks
                    }
                break;

                case "user":
                    this.user = {
                        id: data[t].u_id,
                        username: data[t].u_name,
                        displayName: data[t].d_name,
                        avatar: data[t].img_url_small,
                        cosmetics: data[t].cosmetics
                    }
                break;
            }
        }
    }
}