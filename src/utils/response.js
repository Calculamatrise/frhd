export default class {
    constructor(data) {
        if (!data || typeof data !== "object") throw new Error("INVALID_DATA_TYPE");
        this.message = null,
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "msg":
                    this.message = data[t];
                    if (this.result && !this.message)
                        this.message = "Success!";
                break;

                case "data":
                    if (data[t].subscriber_cnt)
                        this.subscriberCount = data[t].subscriber_cnt;
                break;

                default:
                    this[t] = data[t];
                break;
            }
        }
    }
}