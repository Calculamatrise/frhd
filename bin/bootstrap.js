#!/usr/bin/env node

import Terminal from "./utils/Terminal.js";

const terminal = new Terminal();

const args = process.argv.slice(2);

if (args.length > 0) {
    terminal.execute(args[0]);
} else {
    console.log("Routes (type exit at any time to break the loop):\n\t- " + terminal.routes.join("\n\t- "));

    terminal.interface.close();
}