export default class {
    constructor(data, raceData) {
        if (!data || typeof data !== "object") throw new Error("INVALID_DATA_TYPE");
        this.desktop = null,
        this.runTime = null,
        this.user = null,
        this.init(data);
        this.initRaceData(raceData);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "desktop":
                    this.desktop = data[t];
                break;

                case "run_time":
                    this.runTime = data[t];
                break;

                case "user":
                    this.user = {
                        id: data[t].u_id,
                        username: data[t].u_name,
                        displayName: data[t].d_name,
                        displayNameShort: data[t].d_name_short,
                        avatar: data[t].img_url_small
                    }
                break;
            }
        }
    }
    initRaceData(data) {
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
                    this.user.cosmetics = data[t].cosmetics;
                break;
            }
        }
    }
}