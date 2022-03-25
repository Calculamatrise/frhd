export default class {
    events = new Map();
    keymap = ["up", "down", "left", "right", "z"];
    records = new Map(this.keymap.map((item) => [
        item, {
            down: new Set(),
            up: new Set()
        }
    ]));
    ticks = 0;
    /**
     * 
     * @param {String} event 
     * @param {Function} listener 
     */
    on(event, listener) {
        if (this.events.has(event) === false) {
            this.events.set(event, []);
        }

        let events = this.events.get(event);
        events.push(event, listener);

        if (event === "tick") {
            this.emit(event, this.ticks);
        }

        return listener;
    }

    /**
     * 
     * @param {String} event 
     * @param  {...any} args 
     */
    emit(event, ...args) {
        let events = this.events.get(event) || [];
        if (typeof this["on" + event] === "function") {
            events.push(this["on" + event]);
        }

        events.forEach((event) => {
            if (typeof event === "function") {
                event.apply(this, args);
            }
        });
    }

    /**
     * 
     * @param {Number} max 
     */
    tick(max = Infinity) {
        if (this.ticks >= max) {
            this.complete();
            return;
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
    setKeyDown(key) {
        let keys = null;
        if (arguments.length > 1) {
            keys = [...arguments];
        }

        if (typeof key === "object") {
            keys = key;
        }

        if (keys !== null) {
            if (Array.isArray(keys)) {
                for (const key of keys) {
                    this.setKeyDown.call(this, key);
                }

                return;
            }

            for (const key in keys) {
                this.setKeyDown.call(this, key);
            }

            return;
        }

        if (this.keymap.indexOf(key) === -1) {
            console.warn("Key does not exist in keymap!");
            return;
        }

        let record = this.records.get(key);
        if (record.down.size > record.up.size) {
            console.warn("Key is already down!");
            return;
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
    toggleKey(key) {
        let keys = null;
        if (arguments.length > 1) {
            keys = [...arguments];
        }

        if (typeof key === "object") {
            keys = key;
        }

        if (keys !== null) {
            if (Array.isArray(keys)) {
                for (const key of keys) {
                    this.toggleKey.call(this, key);
                }

                return;
            }

            for (const key in keys) {
                this.toggleKey.call(this, key);
            }

            return;
        }

        if (this.keymap.indexOf(key) === -1) {
            console.warn("Key does not exist in keymap!");
            return;
        }

        let record = this.records.get(key);
        if (record.down.size === record.up.size) {
            this.setKeyDown(key);
            return;
        }

        this.setKeyUp(key);
    }

    /**
     * 
     * @param {String} key 
     */
    setKeyUp(key) {
        let keys = null;
        if (arguments.length > 1) {
            keys = [...arguments];
        }

        if (typeof key === "object") {
            keys = key;
        }

        if (keys !== null) {
            if (Array.isArray(keys)) {
                for (const key of keys) {
                    this.setKeyUp.call(this, key);
                }

                return;
            }

            for (const key in keys) {
                this.setKeyUp.call(this, key);
            }

            return;
        }

        if (this.keymap.indexOf(key) === -1) {
            console.warn("Key does not exist in keymap!");
            return;
        }

        let record = this.records.get(key);
        if (record.down.size === record.up.size) {
            console.warn("Key is already up!");
            return;
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
        this.records = new Map(this.keymap.map((item) => [
            item, {
                down: new Set(),
                up: new Set()
            }
        ]));
        this.ticks = 0;
    }
}