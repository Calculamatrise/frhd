import readline from "readline";

import { Builder, Client, getTrack, getUser } from "../../src/bootstrap.js";

export default class {
    constructor() {
        this.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    routes = [
        "Builder",
        "Client",
        "Track",
        "User"
    ]

    /**
     * 
     * @param {string} query inquiry
     * @param {function} callback callback function
     */
    askIndefinitely(query, callback = function() {}) {
        this.interface.question(query, async (...args) => {
            const response = await callback(...args);
            if (response) {
                this.askIndefinitely(response, callback);
            }
        });
    }

    execute(value) {
        let query;

        switch(value.toLowerCase()) {
            case "build":
            case "builder":
                const builder = new Builder();

                this.askIndefinitely(query = `Type one of the following commands:
    - arc
    - arcTo
    - beginPath
    - bezierCurveTo
    - clearRect
    - closePath
    - createImageData
    - drawImage
    - fill (disabled)
    - fillRect
    - getImageData
    - getLineDash
    - lineTo
    - measureText
    - moveTo
    - oval
    - putImageData
    - quadraticCurveTo
    - rect
    - restore
    - rotate
    - save
    - scale
    - setLineDash
    - stroke
    - strokeLine
    - strokeRect
    - star
    - boost
    - gravity
    - slowmo
    - bomb
    - checkpoint
    - antigravity
    - teleport
    - heli
    - truck
    - balloon
    - blob
    - translate
    - scale
    
> `, (input) => {
                    const [ method, ...args ] = input.split(/\s+/g)

                    if (method.length <= 0) {
                        return "> ";
                    }
            
                    switch(method.toLowerCase()) {
                        case "exit":
                            break;

                        default:
                            if (typeof builder[method] === "function") {
                                if (args.length !== builder[method].length) {
                                    console.error(builder[method].name + " requires " + builder[method].length + " positional parameter(s).");

                                    return "> ";
                                }

                                builder[method](...args);

                                return builder.code + "\n> ";
                            } else {
                                return query;
                            }
                    }
            
                    this.interface.close();
                });
    
                break;

            case "cli":
            case "client":
                const client = new Client();

                this.askIndefinitely(query = "Type one of the following commands:\n\t- login\n\t- defaultLogin\n\t- changeUsername\n\t- changeDescription\n\t- changePassword\n\t- setForumPassword\n\t- buyHead\n\t- setHead\n\t- addFriend\n\t- acceptFriend\n\t- removeFriend\n\t- subscribe\n\t- unsubscribe\n\t- postTrack\n\t- redeemCoupon\n\t- logout\n\n> ", async (input) => {
                    const [ method, ...args ] = input.split(/\s+/g)

                    if (method.length <= 0) {
                        return "> ";
                    }
            
                    switch(method.toLowerCase()) {
                        case "exit":
                            break;

                        default:
                            if (typeof client[method] === "function") {
                                if (args.length !== client[method].length) {
                                    console.error(client[method].name + " requires " + client[method].length + " positional parameter(s).");

                                    return "> ";
                                }

                                client[method](...args);

                                return client.code + "\n> ";
                            } else {
                                return query;
                            }
                    }
            
                    this.interface.close();
                });

                break;
    
            case "track":
                this.askIndefinitely(query = "Enter the track ID:\n> ", async (input) => {
                    const [ method, ...args ] = input.split(/\s+/g)

                    if (method.length <= 0) {
                        return "> ";
                    }
            
                    switch(method.toLowerCase()) {
                        case "exit":
                            break;

                        default:
                            if (!isNaN(parseFloat(method))) {
                                console.log(await getTrack(parseInt(method)));
                                return "> ";
                            } else {
                                return query;
                            }
                    }
            
                    this.interface.close();
                });

                break;

            case "user":
                this.askIndefinitely(query = "Enter a username:\n> ", async (input) => {
                    const [ method, ...args ] = input.split(/\s+/g)

                    if (method.length <= 0) {
                        return "> ";
                    }
            
                    switch(method.toLowerCase()) {
                        case "exit":
                            break;

                        default:
                            console.log(await getUser(method));
                            return "> ";
                    }
            
                    this.interface.close();
                });

                break;

            default:
                console.log("Routes (type exit at any time to break the loop):\n\t- " + this.routes.join("\n\t- "));

                this.interface.close();

                break;
        }
    }
}