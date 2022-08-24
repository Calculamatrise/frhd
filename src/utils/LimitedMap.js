export default class extends Map {
    limit = Infinity;
    constructor(options = {}) {
        super();

        this.limit = ~~options.limit || this.limit;
    }

    set(key, value) {
        if (this.size >= this.limit) {
            this.delete([...this].shift()[0]);
        }

        super.set(key, value);
    } 
}