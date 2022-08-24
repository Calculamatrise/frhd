import EventEmitter from "events";

export default class extends EventEmitter {
    keymap = new Set();
    records = new Map();
    constructor() {
        super();

        this.keymap.add("down");
        this.keymap.add("left");
        this.keymap.add("right");
        this.keymap.add("up");
        this.keymap.add("z");

        this.reset();
    }

    /**
     * 
     * @param {Number} [max]
     */
    tick(max = Infinity) {
        if (this.ticks >= max) {
            return void this.complete();
        }

        // update records here instead; a downkeys set can be used, then
        this.emit("tick", ++this.ticks);
    }

    complete() {
        this.emit("complete", this.getReplayString());
        this.reset();
    }

    /**
     * 
     * @param {String} key 
     */
    down(key) {
        let keys = null;
        if (arguments.length > 1) {
            keys = [...arguments];
        } else if (key instanceof Object) {
            keys = Object.keys(key);
        }

        if (keys !== null) {
            for (const key of keys) {
                this.down.call(this, key);
            }
            return;
        }

        if (this.keymap.indexOf(key) === -1) {
            return void console.warn("Key does not exist in keymap!");
        }

        let record = this.records.get(key);
        if (record.down.size > record.up.size) {
            return void console.warn("Key is already down!");
        }

        if (record.up.delete(this.ticks)) {
            return;
        }

        record.down.add(this.ticks);
    }

    /**
     * 
     * @param {String} key 
     */
    toggle(key) {
        let keys = null;
        if (arguments.length > 1) {
            keys = [...arguments];
        } else if (key instanceof Object) {
            keys = Object.keys(key);
        }

        if (keys !== null) {
            for (const key of keys) {
                this.toggle.call(this, key);
            }
            return;
        }

        if (this.keymap.indexOf(key) === -1) {
            return void console.warn("Key does not exist in keymap!");
        }

        let record = this.records.get(key);
        if (record.down.size === record.up.size) {
            return void this.down(key);
        }

        this.up(key);
    }

    /**
     * 
     * @param {String} key 
     */
    up(key) {
        let keys = null;
        if (arguments.length > 1) {
            keys = [...arguments];
        } else if (key instanceof Object) {
            keys = Object.keys(key);
        }

        if (keys !== null) {
            for (const key of keys) {
                this.up.call(this, key);
            }
            return;
        }

        if (this.keymap.indexOf(key) === -1) {
            return void console.warn("Key does not exist in keymap!");
        }

        let record = this.records.get(key);
        if (record.down.size === record.up.size) {
            return void console.warn("Key is already up!");
        }

        if (record.down.delete(this.ticks)) {
            return;
        }

        record.up.add(this.ticks);
    }

    getReplayString() {
        let records = {};
        this.records.forEach((record, key) => {
            for (const position in record) {
                if (record[position].size === 0) {
                    continue;
                }

                records[key + "_" + position] = Array.from(record[position]);
            }
        });

        return records;
    }

    reset() {
        this.records.clear();
        this.keymap.forEach(key => {
            this.records.set(key, {
                down: new Set(),
                up: new Set()
            });
        });
        this.ticks = 0;
    }
}