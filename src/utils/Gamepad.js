import EventEmitter from "events";

import GamepadEvents from "./GamepadEvents.js";

export default class extends EventEmitter {
    keymap = new Set(["down", "left", "right", "up", "z"]);
    records = new Map(Array.from(this.keymap.values()).map(key => [key, new Set()]));
    ticks = 0;

    /**
     * 
     * @param {Number} [max]
     */
    tick(max = Infinity) {
        if (this.ticks >= max) {
            return void this.complete();
        }

        // update records here instead; a downkeys set can be used, then
        this.emit(GamepadEvents.Tick, ++this.ticks);
    }

    complete() {
        this.emit(GamepadEvents.Complete, this.getReplayString());
        this.reset();
    }

    /**
     * 
     * @param {String} key
     */
    down(key) {
        if (arguments.length > 1) {
            for (const key of arguments) {
                this.down(key);
            }

            return;
        }

        if (!this.keymap.has(key)) {
            return void console.warn("Key does not exist in keymap!");
        }

        let record = this.records.get(key);
        if (record.size % 2 === 1) {
            return void console.warn("Key is already down!");
        } else if (record.delete(this.ticks)) {
            return;
        }

        record.add(this.ticks);
        this.emit(GamepadEvents.KeyDown, key, this.ticks);
    }

    /**
     * 
     * @param {String} key 
     */
    toggle(key) {
        if (arguments.length > 1) {
            for (const key of arguments) {
                this.toggle(key);
            }

            return;
        }

        if (!this.keymap.has(key)) {
            return void console.warn("Key does not exist in keymap!");
        }

        this[this.records.get(key).size % 2 === 0 ? 'down' : 'up'](key);
    }

    /**
     * 
     * @param {String} key 
     */
    up(key) {
        if (arguments.length > 1) {
            for (const key of arguments) {
                this.up(key);
            }

            return;
        }

        if (!this.keymap.has(key)) {
            return void console.warn("Key does not exist in keymap!");
        }

        let record = this.records.get(key);
        if (record.size % 2 === 0) {
            return void console.warn("Key is already up!");
        } else if (record.delete(this.ticks)) {
            return;
        }

        record.add(this.ticks);
        this.emit(GamepadEvents.KeyUp, key, this.ticks);
    }

    getReplayString() {
        let records = {};
        for (const [ key, record ] of this.records) {
            const ticks = Array.from(record.values());
            const down = ticks.filter((tick, index) => !(index % 2));
            if (down.length > 0) {
                records[key + '_down'] = down;
            }

            const up = ticks.filter((tick, index) => index % 2);
            if (up.length > 0) {
                records[key + '_up'] = up;
            }
        }

        return JSON.stringify(records);
    }

    reset() {
        for (const record of this.records.values()) {
            record.clear();
        }

        this.ticks = 0;
        this.emit(GamepadEvents.Restart);
    }
}