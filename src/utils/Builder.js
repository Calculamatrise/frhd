export default class {
    x = 0;
    y = 0;
    temp = null;
    strokeStyle = "#000000";
    fillStyle = "#000000";
    #physics = []
    #scenery = []
    #powerups = {
        targets: [],
        boosters: [],
        gravity: [],
        slowmos: [],
        bombs: [],
        checkpoints: [],
        antigravity: [],
        teleporters: [],
        vehicles: {
            heli: [],
            truck: [],
            balloon: [],
            blob: []
        }
    }
    #temp = {
        physics: [],
        scenery: [],
        powerups: {
            targets: [],
            boosters: [],
            gravity: [],
            slowmos: [],
            bombs: [],
            checkpoints: [],
            antigravity: [],
            teleporters: [],
            vehicles: {
                heli: [],
                truck: [],
                balloon: [],
                blob: []
            }
        }
    }
    #segment = []
    get lines() {
        return this.strokeStyle.match(/(#000|black|rgba?\((0(,(\s+)?)?){3,4}\))+/gi) ? this.#physics : this.#scenery;
    }
    get physics() {
        return this.#physics.map(t => t.map(t => t.toString(32)).join(" ")).join(",");
    }
    get scenery() {
        return this.#scenery.map(t => t.map(t => t.toString(32)).join(" ")).join(",");
    }
    get powerups() {
        let powerups = "";
        for (const t in this.#powerups) {
            switch(t) {
                case "targets":
                    for (const e of this.#powerups[t]) {
                        powerups += `T ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "boosters":
                    for (const e of this.#powerups[t]) {
                        powerups += `B ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "gravity":
                    for (const e of this.#powerups[t]) {
                        powerups += `G ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "slowmos":
                    for (const e of this.#powerups[t]) {
                        powerups += `S ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "bombs":
                    for (const e of this.#powerups[t]) {
                        powerups += `O ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "checkpoints":
                    for (const e of this.#powerups[t]) {
                        powerups += `C ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "antigravity":
                    for (const e of this.#powerups[t]) {
                        powerups += `A ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "teleporters":
                    for (const e of this.#powerups[t]) {
                        powerups += `W ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "vehicles":
                    for (const e in this.#powerups[t]) {
                        for (const i of this.#powerups[t][e]) {
                            powerups += `V ${i.map(t => t.toString(32)).join(" ")},`;
                        }
                    }
                break;
            }
        }
        return powerups;
    }
    get code() {
        return this.physics + "#" + this.scenery + "#" + this.powerups;
    }
    import(t) {
        if (typeof t === "string")
            t = t.split(/\u0023/g).map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));;
        this.#physics = t[0] ? t[0].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        this.#scenery = t[1] ? t[1].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        for (const e of t[2]) {
            switch(e[0]) {
                case "T":
                    this.#powerups.targets.push(e.slice(1).map(t => parseInt(t, 32)));
                break;
                
                case "B":
                    this.#powerups.boosters.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "G":
                    this.#powerups.gravity.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "S":
                    this.#powerups.slowmos.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "O":
                    this.#powerups.bombs.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "C":
                    this.#powerups.checkpoints.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "A":
                    this.#powerups.antigravity.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "W":
                    this.#powerups.teleporters.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "V":
                    switch(e[3]) {
                        case "1":
                            this.#powerups.vehicles.heli.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "2":
                            this.#powerups.vehicles.truck.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "3":
                            this.#powerups.vehicles.balloon.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "4":
                            this.#powerups.vehicles.blob.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;
                    }
                break;
            }
        }
        return this;
    }
    beginPath() {
        this.x = 0;
        this.y = 0;

        return this;
    }

    /**
     * 
     * @param {number|string} x position x of the starting point
     * @param {number|string} y position y of the starting point
     * @returns object
     */
    moveTo(x, y) {
        for (const argument of arguments) {
            if (isNaN(parseFloat(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.x = parseFloat(x);
        this.y = parseFloat(y);

        return this;
    }

    /**
     * 
     * @param {number|string} x position x of the end point
     * @param {number|string} y position y of the end point
     * @returns object
     */
    lineTo(x, y) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.lineTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(parseFloat(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.#segment.push([
            this.x, this.y,
            x, y
        ]);
        
        this.x = parseFloat(x);
        this.y = parseFloat(y);

        return this;
    }

    /**
     * 
     * @param {number|string} x position x of the starting point
     * @param {number|string} y position y of the starting point
     * @param {number|string} x2 position x of the end point
     * @param {number|string} y2 position y of the end point
     * @returns object
     */
    strokeLine(x, y, x2, y2) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.strokeLine(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(parseFloat(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.#segment.push([
            parseFloat(x), parseFloat(y),
            parseFloat(x2), parseFloat(y2)
        ]);

        return this;
    }

    /**
     * 
     * @alias curveTo
     * @param {string|number} p1x position x of the control point
     * @param {string|number} p1y position y of the control point
     * @param {string|number} p2x position x of the end point
     * @param {string|number} p2y position y of the end point
     * @returns object
     */
    quadraticCurveTo(p1x, p1y, p2x, p2y) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.quadraticCurveTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        const p0 = { x: this.x, y: this.y }
        const p1 = { x: parseFloat(p1x), y: parseFloat(p1y) }
        const p2 = { x: parseFloat(p2x), y: parseFloat(p2y) }
        for (let i = 0; i < 1; i += 1 / 10) {
            this.lineTo(Math.pow((1 - i), 2) * p0.x + 2 * (1 - i) * i * p1.x + Math.pow(i, 2) * p2.x, Math.pow((1 - i), 2) * p0.y + 2 * (1 - i) * i * p1.y + Math.pow(i, 2) * p2.y);
        }

        return this;
    }
    curveTo = this.quadraticCurveTo;

    /**
     * 
     * @param {string|number} p1x position x of the first control point
     * @param {string|number} p1y position y of the first control point
     * @param {string|number} p2x position x of the second control point
     * @param {string|number} p2y position y of the second control point
     * @param {string|number} p3x position x of the end point
     * @param {string|number} p3y position y of the end point
     * @returns object
     */
    bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.bezierCurveTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        const p0 = { x: this.x, y: this.y }
        const p1 = { x: parseFloat(p1x), y: parseFloat(p1y) }
        const p2 = { x: parseFloat(p2x), y: parseFloat(p2y) }
        const p3 = { x: parseFloat(p3x), y: parseFloat(p3y) }
        for (let i = 0, cX, bX, aX, cY, bY, aY; i < 1.01; i += (1000 / Math.abs(Math.abs(p0.x * p0.y) - Math.abs(p3.x * p3.y))) / 10) {
            cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX,
            cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY,
            this.lineTo((aX * Math.pow(i, 3)) + (bX * Math.pow(i, 2)) + (cX * i) + p0.x, (aY * Math.pow(i, 3)) + (bY * Math.pow(i, 2)) + (cY * i) + p0.y);
        }

        return this;
    }

    /**
     * 
     * @param {number|string} x position x
     * @param {number|string} y position y
     * @param {number|string} radius 
     * @param {number|string} startAngle angle in radians
     * @param {number|string} endAngle angle in radians
     * @param {boolean} counterClockwise 
     * @returns object
     */
    arc(x, y, radius, startAngle, endAngle, counterClockwise = false) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.arc(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (typeof argument === "boolean") {
                continue;
            }

            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        const points = []
        if (counterClockwise) {
            for (let i = parseFloat(startAngle) * 180 / Math.PI % 360; i >= -360 + parseFloat(endAngle) * 180 / Math.PI % 360; i -= 750 / parseFloat(radius)) {
                points.push(parseFloat(x) + parseFloat(radius) * Math.cos(i * Math.PI / 180), parseFloat(y) + parseFloat(radius) * Math.sin(i * Math.PI / 180));
            }
        } else {
            for (let i = parseFloat(startAngle) * 180 / Math.PI % 360; i <= (parseFloat(endAngle) * 180 / Math.PI % 360 || 360); i += 750 / parseFloat(radius)) {
                points.push(parseFloat(x) + parseFloat(radius) * Math.cos(i * Math.PI / 180), parseFloat(y) + parseFloat(radius) * Math.sin(i * Math.PI / 180));
            }
        }

        this.x = points[points.length - 2];
        this.y = points[points.length - 1];

        this.#segment.push(points);

        return this;
    }

    /**
     * 
     * @param {number|string} cpx position x of the control point
     * @param {number|string} cpy position y of the control point
     * @param {number|string} x position x of the end point
     * @param {number|string} y position y of the end point
     * @param {number|string} radius 
     * @returns object
     */
    arcTo(cpx, cpy, x, y, radius) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.arcTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        const p0 = { x: this.x + (parseFloat(cpx) - this.x) - parseFloat(radius), y: this.y }
        const p1 = { x: parseFloat(cpx), y: parseFloat(cpy) }
        const p2 = { x: parseFloat(x), y: y + (parseFloat(cpy) - parseFloat(y)) + parseFloat(radius) }
        for (let i = 0; i < 1.01; i += (750 / parseFloat(radius)) / 100) {
            this.lineTo([
                Math.pow((1 - i), 2) * p0.x + 2 * (1 - i) * i * p1.x + Math.pow(i, 2) * p2.x,
                Math.pow((1 - i), 2) * p0.y + 2 * (1 - i) * i * p1.y + Math.pow(i, 2) * p2.y
            ]);
        }

        return this;
    }
    filledCircle(xx, yy, radius) {
        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        for (let y = -radius; y < radius; y++) {
            let x = 0;
            while(Math.hypot(x, y) <= radius) {
                x++
            }
            this.#segment.push([
                xx - x, yy + y,
                xx + x, yy + y
            ]);
        }

        return this;
    }
    oval(x, y, width, height, s) {
        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        if (s < 3) {
            switch(s) {
                case 1:
                    s += 2;
                    break;
                case 2:
                    s += 1
            }
        }

        var arr = [];
        if (s === void 0) s = 5;
        for(let i = 0; i <= 360; i += s) {
            arr.push(x + width * Math.cos(i * Math.PI / 180), y + height * Math.sin(i * Math.PI / 180))
        }

        this.#segment.push(arr);

        return this;
    }
    rect(x, y, width, height) {
        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.#segment.push([
            x, y,
            x + width, y,
            x + width, y + height,
            x, y + height,
            x, y
        ]);
        
        return this;
    }
    filledRect(x, y, width, height) {
        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        for (let i = y; i < y + height; i++) {
            this.#segment.push([
                x, i,
                x + width, i
            ]);
        }

        return this;
    }
    closePath() {
        if (!this.#segment[0]) {
            return this;
        }

        for (const line of this.#segment) {
            if (line.length < 1) {
                return;
            }
            
            for (const argument of line) {
                if (isNaN(parseFloat(argument))) {
                    return;
                }
            }
        }

        let [ x, y ] = this.#segment[0];

        this.lineTo(x, y);

        return this;
    }
    stroke() {
        for (const t in this.#temp) {
            switch(t) {
                case "physics":
                    this.#physics.push(...this.#temp[t]);
                    break;
                
                case "scenery":
                    this.#scenery.push(...this.#temp[t]);
                    break;

                case "powerups":
                    break;
                    for (const e in this.#temp[t]) {
                        switch(e) {
                            case "vehicles":
                                for (const i in this.#temp[t][e])
                                    this.powerups[e][i].push(...this.#temp[t][e][i]);
                            break;

                            default:
                                this.#powerups[e].push(...this.#temp[t][e]);
                            break;
                        } 
                    }
                    break;
            }
        }
        this.#temp = {
            physics: [],
            scenery: [],
            powerups: {
                targets: [],
                boosters: [],
                gravity: [],
                slowmos: [],
                bombs: [],
                checkpoints: [],
                antigravity: [],
                teleporters: [],
                vehicles: {
                    heli: [],
                    truck: [],
                    balloon: [],
                    blob: []
                }
            }
        }
        return this;
    }
    fill() {
        this.lines.push(...this.#segment);

        this.#segment = []

        return this;
    }
    save() {
        this.temp = {
            x: this.x,
            y: this.y,
            strokeStyle: this.strokeStyle,
            fillStyle: this.fillStyle
        }

        return this;
    }
    stroke() {
        this.lines.push(...this.#segment);

        this.#segment = []

        return this;
    }
    restore() {
        for (const t in this.temp) {
            this[t] = this.temp[t];
        }

        this.temp = null;

        return this;
    }
    drawDefaultLine() {
        this.moveTo(-40, 50);
        this.lineTo(40, 50);

        return this;
    }
    drawTarget(x, y) {
        this.#powerups.targets.push([x, y]);

        return this;
    }
    drawBoost(x, y, d) {
        this.#powerups.boosts.push([x, y, d]);

        return this;
    }
    drawGravity(x, y) {
        this.#powerups.gravity.push([x, y, d]);

        return this;
    }
    drawSlowmo(x, y) {
        this.#powerups.slowmos.push([x, y]);

        return this;
    }
    drawBomb(x, y) {
        this.#powerups.bombs.push([x, y]);

        return this;
    }
    drawCheckpoint(x, y) {
        this.#powerups.checkpoints.push([x, y]);

        return this;
    }
    drawAntigravity(x, y) {
        this.#powerups.antigravity.push([x, y]);

        return this;
    }
    drawTeleport(x, y, ex, ey) {
        this.#powerups.teleporters.push([x, y, ex, ey]);

        return this;
    }
    drawHeli(x, y, t) {
        this.#powerups.vehicles.heli.push([x, y, 1, t]);

        return this;
    }
    drawTruck(x, y, t) {
        this.#powerups.vehicles.truck.push([x, y, 2, t]);

        return this;
    }
    drawBalloon(x, y, t) {
        this.#powerups.vehicles.balloon.push([x, y, 3, t]);

        return this;
    }
    drawBlob(x, y, t) {
        this.#powerups.vehicles.blob.push([x, y, 4, t]);

        return this;
    }
    move(x = 0, y = 0) {
        for (const t of this.#physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }

        for (const t of this.#scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }

        for(const t in this.#powerups) {
            for (const e in this.#powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this.#powerups[t][e][2] += x;
                        this.#powerups[t][e][3] += y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this.#powerups[t][e][0] += x;
                        this.#powerups[t][e][1] += y;
                    break;
                    
                    case "vehicles":
                        for (const i in this.#powerups[t][e]) {
                            this.#powerups[t][e][i][0] += x;
                            this.#powerups[t][e][i][1] += y;
                        }
                    break;
                }
            }
        }

        return this;
    }
    rotate(x = 0) {
        if (isNaN(parseInt(x))) {
            throw new Error("INVALID_VALUE")
        }

        let rotationFactor = x;
        x *= Math.PI / 180;
        for (const t of this.#physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = t[e] * Math.cos(x) + t[e + 1] * Math.sin(x),
                t[e + 1] = t[e + 1] * Math.cos(x) - t[e] * Math.sin(x);
            }
        }

        for (const t of this.#scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = t[e] * Math.cos(x) + t[e + 1] * Math.sin(x),
                t[e + 1] = t[e + 1] * Math.cos(x) - t[e] * Math.sin(x);
            }
        }

        for (const t in this.#powerups) {
            for(const e in this.#powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this.#powerups[t][e][2] = this.#powerups[t][e][2] * Math.cos(x) + this.#powerups[t][e][3] * Math.sin(x),
                        this.#powerups[t][e][3] = this.#powerups[t][e][3] * Math.cos(x) - this.#powerups[t][e][2] * Math.sin(x);
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this.#powerups[t][e][0] = this.#powerups[t][e][0] * Math.cos(x) + this.#powerups[t][e][1] * Math.sin(x),
                        this.#powerups[t][e][1] = this.#powerups[t][e][1] * Math.cos(x) - this.#powerups[t][e][0] * Math.sin(x);
                        if (["boosters", "gravity"].includes(t)) {
                            this.#powerups[t][e][2] += rotationFactor;
                        }
                    break;

                    case "vehicles":
                        for (const i in this.#powerups[t][e]) {
                            this.#powerups[t][e][i][0] = this.#powerups[t][e][i][0] * Math.cos(x) + this.#powerups[t][e][i][1] * Math.sin(x),
                            this.#powerups[t][e][i][1] = this.#powerups[t][e][i][1] * Math.cos(x) - this.#powerups[t][e][i][0] * Math.sin(x);
                        }
                    break;
                }
            }
        }
        
        return this;
    }
    scale(x = 1, y = 1) {
        for (const t of this.#physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += t[e] * x;
                t[e + 1] += t[e + 1] * y;
            }
        }

        for (const t of this.#scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += t[e] * x;
                t[e + 1] += t[e + 1] * y;
            }
        }

        for (const t in this.#powerups) {
            for(const e in this.#powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this.#powerups[t][e][2] += this.#powerups[t][e][2] * x;
                        this.#powerups[t][e][3] += this.#powerups[t][e][3] * y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this.#powerups[t][e][0] += this.#powerups[t][e][0] * x;
                        this.#powerups[t][e][1] += this.#powerups[t][e][1] * y;
                    break;

                    case "vehicles":
                        for (const i in this.#powerups[t][e]) {
                            this.#powerups[t][e][i][0] += this.#powerups[t][e][i][0] * x;
                            this.#powerups[t][e][i][1] += this.#powerups[t][e][i][1] * y;
                        }
                    break;
                }
            }
        }

        return this;
    }
    clear() {
        this.#physics = [],
        this.#scenery = [],
        this.#powerups = {
            targets: [],
            slowmos: [],
            bombs: [],
            checkpoints: [],
            antigravity: [],
            boosters: [],
            gravity: [],
            teleporters: [],
            vehicles: {
                heli: [],
                truck: [],
                balloon: [],
                blob: []
            }
        }
        this.#temp = {
            physics: [],
            scenery: [],
            powerups: {
                targets: [],
                boosters: [],
                gravity: [],
                slowmos: [],
                bombs: [],
                checkpoints: [],
                antigravity: [],
                teleporters: [],
                vehicles: {
                    heli: [],
                    truck: [],
                    balloon: [],
                    blob: []
                }
            }
        }
        
        return this;
    }
}