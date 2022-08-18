export default class {
    #terminal = null;
    constructor(terminal, args) {
        this.#terminal = terminal;
        this.arguments = args.filter(value => {
            value = /^-{2}/.test(value) && value.replace(/^--/g, '').split("=");
            value && this.flags.set(value[0], value[1] ?? true);
            return !value;
        });
    }
    arguments = [];
    flags = new Map();
    /**
     * 
     * @param {String} data inquiry 
     * @param {Function} callback callback function 
     */
    async write(data, callback) {
        return new Promise(resolve => {
            this.#terminal.question(data, input => {
                if (/^exit$/i.test(input)) {
                    return this.#terminal.close();
                } else if (typeof callback == "function") {
                    callback(input);
                }

                resolve(input);
            });
        });
    }

    end(data) {
        data !== void 0 && console.log(data);
        this.#terminal.close();
    }
}