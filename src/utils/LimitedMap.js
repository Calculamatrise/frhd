export default class extends Map {
    constructor({ limit = Infinity } = {}) {
        super();
        this.limit = limit;
    }

    set(key, value) {
        if (this.limit) {
            if (this.size >= this.limit) {
                this.delete([...this].shift()[0]);
            }
        }

        super.set(key, value);
    } 
}