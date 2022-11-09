#!/usr/bin/env node

import Terminal from "./utils/Terminal.js";

import { Builder, Client, getTrack, getUser } from "../src/index.js";

const terminal = new Terminal();

terminal.when("builder", function(response) {
    const builder = new Builder();
    // Reflect.ownKeys(Builder.prototype).filter(key => key != 'constructor').filter(key => key.startsWith(query))
    const methods = Reflect.ownKeys(Builder.prototype).filter(key => key != 'constructor' && typeof builder[key] == 'function');
    response.write(`Type one of the following commands:\n  - ${methods.join('\n  - ')}\n\n> `, (input) => {
        const [ method, ...args ] = input.split(/\s+/g)
        if (typeof builder[method] === "function") {
            if (args.length !== builder[method].length) {
                console.error(builder[method].name + " requires " + builder[method].length + " positional parameter(s).");
                return "> ";
            }

            builder[method](...args);
            return builder.code + "\n> ";
        } else {
            response.end(`Client#${method} is not a method`);
            return;
        }

        response.end();
    });
});

terminal.when("client", function recurse(response) {
    const client = new Client();
    response.write("Type one of the following commands:\n\t- login\n\t- defaultLogin\n\t- changeUsername\n\t- changeDescription\n\t- changePassword\n\t- setForumPassword\n\t- buyHead\n\t- setHead\n\t- addFriend\n\t- acceptFriend\n\t- removeFriend\n\t- subscribe\n\t- unsubscribe\n\t- postTrack\n\t- redeemCoupon\n\t- logout\n\n> ", async (input) => {
        const [ method, ...args ] = input.split(/\s+/g)
        if (typeof client[method] === "function") {
            if (args.length !== client[method].length) {
                console.error(client[method].name + " requires " + client[method].length + " positional parameter(s).");
                return "> ";
            }

            client[method](...args);
            return client.code + "\n> ";
        } else {
            response.end(`Client#${method} is not a method`);
            return;
        }

        response.end();
    });
});

terminal.when("track", async function(response) {
    let track = await response.write("Enter the track ID:\n> ");
    response.end(await getTrack(~~track));
});

terminal.when("user", async function(response) {
    let input = await response.write("Enter a username:\n> ");
    response.end(await getUser(input));
});

terminal.connect();