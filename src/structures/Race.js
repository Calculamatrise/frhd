export default class {
    code = null;
    desktop = true;
    placement = null;
    runTicks = 0;
    runTime = null;
    tablet = false;
    user = null;
    vehicle = 'MTB';
    constructor(data) {
        if (typeof data != "object") {
            throw new TypeError("INVALID_DATA_TYPE");
        }

        this.init(data);
    }
    
    init(data) {
        for (const t in data) {
            switch(t) {
                case "u_id":
                    this.userId = data[t];
                    break;

                case "tablet":
                    this[t] = data[t];
                    break;

                case "place":
                    this.placement = data[t];
                    break;

                case "run_time":
                    this.runTime = data[t];
                    break;

                case "race":
                    this.code = JSON.parse(data[t].code),
                    this.vehicle = data[t].vehicle,
                    this.desktop = data[t].desktop,
                    this.runTicks = data[t].run_ticks;
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