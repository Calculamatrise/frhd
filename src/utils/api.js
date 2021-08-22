export default class {
    constructor() {
        this.x = 0,
        this.y = 0,
        this.snapTo = !0,
        this.temp = null,
        this.strokeStyle = "#000000",
        this.fillStyle = "#000000",
        this._physics = [],
        this._scenery = [],
        this._powerups = {
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
                blob: [],
                glider: []
            }
        }
        this._temp = {
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
                    blob: [],
                    glider: []
                }
            }
        }
    }
    import(t) {
        if (typeof t === "string")
            t = t.split(/\u0023/g).map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));;
        this._physics = t[0] ? t[0].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        this._scenery = t[1] ? t[1].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        for (const e of t[2]) {
            switch(e[0]) {
                case "T":
                    this._powerups.targets.push(e.slice(1).map(t => parseInt(t, 32)));
                break;
                
                case "B":
                    this._powerups.boosters.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "G":
                    this._powerups.gravity.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "S":
                    this._powerups.slowmos.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "O":
                    this._powerups.bombs.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "C":
                    this._powerups.checkpoints.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "A":
                    this._powerups.antigravity.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "W":
                    this._powerups.teleporters.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "V":
                    switch(e[3]) {
                        case "1":
                            this._powerups.vehicles.heli.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "2":
                            this._powerups.vehicles.truck.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "3":
                            this._powerups.vehicles.balloon.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "4":
                            this._powerups.vehicles.blob.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "5":
                            this._powerups.vehicles.glider.push(e.slice(1).map(t => parseInt(t, 32)));
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
    moveTo(x, y) {
        if (x === void 0 || isNaN(x) || y === void 0 || isNaN(y)) throw new Error("INVALID_VALUE");
        this.x = x;
        this.y = y;
        return this;
    }
    lineTo(x, y, ...args) {
        if (x === void 0 || isNaN(x) || y === void 0 || isNaN(y)) throw new Error("INVALID_VALUE");
        if (Array.isArray(arguments[0])) {
            for (const t of arguments) {
                const [ x, y ] = t;
                this.lines.push([this.x, this.y, x, y]);
                if (this.snapTo) {
                    this.x = x;
                    this.y = y;
                }
            }
            return this;
        } else if (arguments[2]) {
            for (let t = 0, e = 1; t < arguments.length; t += 2, e += 2) {
                if (!arguments[t] || isNaN(arguments[t])) throw new Error("INVALID_VALUE");
                if (!arguments[e] || isNaN(arguments[e])) throw new Error("INVALID_VALUE");
                this.lines.push([this.x, this.y, arguments[t], arguments[e]]);
                if (this.snapTo) {
                    this.x = arguments[t];
                    this.y = arguments[e];
                }
            }
            return this;
        }
        this.lines.push([this.x, this.y, x, y]);
        if (this.snapTo) {
            this.x = x;
            this.y = y;
        }
        return this;
    }
    curveTo(p1x, p1y, p2x, p2y) {
        if (p1x === void 0 || isNaN(p1x) || p1y === void 0 || isNaN(p1y) || p2x === void 0 || isNaN(p2x) || p2y === void 0 || isNaN(p2y)) throw new Error("INVALID_VALUE");
        if (Array.isArray(arguments[0])) {
            for (const t of arguments) {
                const [ p1x, p1y, p2x, p2y ] = t;
                let p0 = {x: this.x, y: this.y},
                    p1 = {x: p1x, y: p1y},
                    p2 = {x: p2x, y: p2y};
                for (let i = 0; i < 1; i += 1 / 10) {
                    this.lineTo(Math.pow((1 - i), 2) * p0.x + 2 * (1 - i) * i * p1.x + Math.pow(i, 2) * p2.x,
                    Math.pow((1 - i), 2) * p0.y + 2 * (1 - i) * i * p1.y + Math.pow(i, 2) * p2.y);
                }
            }
            return this;
        }
        const p0 = {x: this.x, y: this.y},
            p1 = {x: p1x, y: p1y},
            p2 = {x: p2x, y: p2y};
        for (let i = 0; i < 1; i += 1 / 10) {
            this.lineTo(Math.pow((1 - i), 2) * p0.x + 2 * (1 - i) * i * p1.x + Math.pow(i, 2) * p2.x,
            Math.pow((1 - i), 2) * p0.y + 2 * (1 - i) * i * p1.y + Math.pow(i, 2) * p2.y);
        }
        return this;
    }
    bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y) {
        if (p1x === void 0 || isNaN(p1x) || p1y === void 0 || isNaN(p1y) || p2x === void 0 || isNaN(p2x) || p2y === void 0 || isNaN(p2y) || p3x === void 0 || isNaN(p3x) || p3y === void 0 || isNaN(p3y)) throw new Error("INVALID_VALUE");
        if (Array.isArray(arguments[0])) {
            for (const t of arguments) {
                const [ p1x, p1y, p2x, p2y, p3x, p3y ] = t;
                let p0 = {x: this.x, y: this.y},
                    p1 = {x: p1x, y: p1y},
                    p2 = {x: p2x, y: p2y},
                    p3 = {x: p3x, y: p3y};
                for (let i = 0, cX, bX, aX, cY, bY, aY; i < 1; i += 1 / 10) {
                    cX = 3 * (p1.x - p0.x),
                    bX = 3 * (p2.x - p1.x) - cX,
                    aX = p3.x - p0.x - cX - bX,
                    cY = 3 * (p1.y - p0.y),
                    bY = 3 * (p2.y - p1.y) - cY,
                    aY = p3.y - p0.y - cY - bY,
                    this.lineTo((aX * Math.pow(i, 3)) + (bX * Math.pow(i, 2)) + (cX * i) + p0.x,
                    (aY * Math.pow(i, 3)) + (bY * Math.pow(i, 2)) + (cY * i) + p0.y);
                }
            }
            return this;
        }
        let p0 = {x: this.x, y: this.y},
            p1 = {x: p1x, y: p1y},
            p2 = {x: p2x, y: p2y},
            p3 = {x: p3x, y: p3y};
        for (let i = 0, cX, bX, aX, cY, bY, aY; i < 1; i += 1 / 10) {
            cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX,
            cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY,
            this.lineTo((aX * Math.pow(i, 3)) + (bX * Math.pow(i, 2)) + (cX * i) + p0.x,
            (aY * Math.pow(i, 3)) + (bY * Math.pow(i, 2)) + (cY * i) + p0.y);
        }
        return this;
    }
    arc(x, y, radius, s) {
        if (x === void 0 || isNaN(x) || y === void 0 || isNaN(y) || radius === void 0 || isNaN(radius)) throw new Error("INVALID_VALUE");
        let arr = [];
        if (s === void 0) s = 5;
        for (let i = 0; i <= 360; i += s) {
            arr.push(x + radius * Math.cos(i * Math.PI / 180), y + radius * Math.sin(i * Math.PI / 180))
        }
        this.lines.push(arr);
        return this;
    }
    circle(x, y, radius, s) {
        if (x === void 0 || isNaN(x) || y === void 0 || isNaN(y) || radius === void 0 || isNaN(radius)) throw new Error("INVALID_VALUE");
        var arr = [];
        if (s === void 0) s = 5;
        for(let i = 0; i <= 360; i += s) {
            arr.push(x + radius * Math.cos(i * Math.PI / 180), y + radius * Math.sin(i * Math.PI / 180))
        }
        this.lines.push(arr);
        return this;
    }
    filledCircle(xx, yy, radius) {
        for(let y = -radius; y < radius; y++) {
            var x = 0;
            while(Math.hypot(x, y) <= radius) {
                x++
            }
            this.lines.push([xx - x, yy + y, xx + x, yy + y]);
        }
        return this;
    }
    oval(x, y, width, height, s) {
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
        this.lines.push(arr);
        return this;
    }
    rect(x, y, width, height) {
        if (x === void 0 || isNaN(x) || y === void 0 || isNaN(y) || width === void 0 || isNaN(width) || height === void 0 || isNaN(height)) throw new Error("INVALID_VALUE");
        this.lines.push([x, y, x + width, y, x + width, y + height, x, y + height, x, y]);
        return this;
    }
    filledRect(x, y, width, height) {
        if (x === void 0 || isNaN(x) || y === void 0 || isNaN(y) || width === void 0 || isNaN(width) || height === void 0 || isNaN(height)) throw new Error("INVALID_VALUE");
        for (let i = y; i < y + height; i++) {
            this.lines.push([x, i, x + width, i]);
        }
        return this;
    }
    closePath() {
        if (!this.lines[0]) return this;
        let [ x, y ] = this.lines[0];
        this.lineTo(x, y);
        return this;
    }
    stroke() {
        for (const t in this._temp) {
            switch(t) {
                case "physics":
                    this._physics.push(...this._temp[t]);
                break;
                
                case "scenery":
                    this._scenery.push(...this._temp[t]);
                break;

                case "powerups":
                    for (const e in this._temp[t]) {
                        switch(e) {
                            case "vehicles":
                                for (const i in this._temp[t][e])
                                    this.powerups[e][i].push(...this._temp[t][e][i]);
                            break;

                            default:
                                this._powerups[e].push(...this._temp[t][e]);
                            break;
                        } 
                    }
                break;
            }
        }
        this._temp = {
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
                    blob: [],
                    glider: []
                }
            }
        }
        return this;
    }
    fill() {
        return this;
    }
    save() {
        this.temp = {
            x: this.x,
            y: this.y,
            snapTo: this.snapTo,
            strokeStyle: this.strokeStyle,
            fillStyle: this.fillStyle
        }
        return this;
    }
    restore() {
        for (const t in this.temp)
            this[t] = this.temp[t];
        this.temp = null;
        return this;
    }
    drawDefaultLine() {
        this.moveTo(-40, 50);
        this.lineTo(40, 50);
        return this;
    }
    drawTarget(x, y) {
        this._powerups.targets.push([x, y]);
        return this;
    }
    drawBoost(x, y, d) {
        this._powerups.boosts.push([x, y, d]);
        return this;
    }
    drawGravity(x, y) {
        this._powerups.gravity.push([x, y, d]);
        return this;
    }
    drawSlowmo(x, y) {
        this._powerups.slowmos.push([x, y]);
        return this;
    }
    drawBomb(x, y) {
        this._powerups.bombs.push([x, y]);
        return this;
    }
    drawCheckpoint(x, y) {
        this._powerups.checkpoints.push([x, y]);
        return this;
    }
    drawAntigravity(x, y) {
        this._powerups.antigravity.push([x, y]);
        return this;
    }
    drawTeleport(x, y, ex, ey) {
        this._powerups.teleporters.push([x, y, ex, ey]);
        return this;
    }
    drawHeli(x, y, t) {
        this._powerups.vehicles.heli.push([x, y, 1, t]);
        return this;
    }
    drawTruck(x, y, t) {
        this._powerups.vehicles.truck.push([x, y, 2, t]);
        return this;
    }
    drawBalloon(x, y, t) {
        this._powerups.vehicles.balloon.push([x, y, 3, t]);
        return this;
    }
    drawBlob(x, y, t) {
        this._powerups.vehicles.blob.push([x, y, 4, t]);
        return this;
    }
    drawGlider(x, y, t) {
        this._powerups.vehicles.glider.push([x, y, 5, t]);
        return this;
    }
    drawVehicle(x, y, vehicle, t) {
        if (!vehicle || isNaN(vehicle)) throw new Error("INVALID_VEHICLE");
        this._powerups.vehicles[vehicle].push("V " + [x, y, vehicle, t]);
        return this;
    }
    move(x = 0, y = 0) {
        for (const t of this._physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }
        for (const t of this._scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }
        for(const t in this._powerups) {
            for (const e in this._powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this._powerups[t][e][2] += x;
                        this._powerups[t][e][3] += y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this._powerups[t][e][0] += x;
                        this._powerups[t][e][1] += y;
                    break;
                    
                    case "vehicles":
                        for (const i in this._powerups[t][e]) {
                            this._powerups[t][e][i][0] += x;
                            this._powerups[t][e][i][1] += y;
                        }
                    break;
                }
            }
        }
        return this;
    }
    rotate(x = 0) {
        if (isNaN(x)) throw new Error("INVALID_VALUE");
        let rotationFactor = x;
        x *= Math.PI / 180;
        for (const t of this._physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = t[e] * Math.cos(x) + t[e + 1] * Math.sin(x),
                t[e + 1] = t[e + 1] * Math.cos(x) - t[e] * Math.sin(x);
            }
        }
        for (const t of this._scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = t[e] * Math.cos(x) + t[e + 1] * Math.sin(x),
                t[e + 1] = t[e + 1] * Math.cos(x) - t[e] * Math.sin(x);
            }
        }
        for (const t in this._powerups) {
            for(const e in this._powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this._powerups[t][e][2] = this._powerups[t][e][2] * Math.cos(x) + this._powerups[t][e][3] * Math.sin(x),
                        this._powerups[t][e][3] = this._powerups[t][e][3] * Math.cos(x) - this._powerups[t][e][2] * Math.sin(x);
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this._powerups[t][e][0] = this._powerups[t][e][0] * Math.cos(x) + this._powerups[t][e][1] * Math.sin(x),
                        this._powerups[t][e][1] = this._powerups[t][e][1] * Math.cos(x) - this._powerups[t][e][0] * Math.sin(x);
                        if (["boosters", "gravity"].includes(t)) {
                            this._powerups[t][e][2] += rotationFactor;
                        }
                    break;

                    case "vehicles":
                        for (const i in this._powerups[t][e]) {
                            this._powerups[t][e][i][0] = this._powerups[t][e][i][0] * Math.cos(x) + this._powerups[t][e][i][1] * Math.sin(x),
                            this._powerups[t][e][i][1] = this._powerups[t][e][i][1] * Math.cos(x) - this._powerups[t][e][i][0] * Math.sin(x);
                        }
                    break;
                }
            }
        }
        return this;
    }
    scale(x = 1, y = 1) {
        for (const t of this._physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += t[e] * x;
                t[e + 1] += t[e + 1] * y;
            }
        }
        for (const t of this._scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += t[e] * x;
                t[e + 1] += t[e + 1] * y;
            }
        }
        for (const t in this._powerups) {
            for(const e in this._powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this._powerups[t][e][2] += this._powerups[t][e][2] * x;
                        this._powerups[t][e][3] += this._powerups[t][e][3] * y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this._powerups[t][e][0] += this._powerups[t][e][0] * x;
                        this._powerups[t][e][1] += this._powerups[t][e][1] * y;
                    break;

                    case "vehicles":
                        for (const i in this._powerups[t][e]) {
                            this._powerups[t][e][i][0] += this._powerups[t][e][i][0] * x;
                            this._powerups[t][e][i][1] += this._powerups[t][e][i][1] * y;
                        }
                    break;
                }
            }
        }
        return this;
    }
    clear() {
        this._physics = [],
        this._scenery = [],
        this._powerups = {
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
                blob: [],
                glider: []
            }
        }
        this._temp = {
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
                    blob: [],
                    glider: []
                }
            }
        }
        return this;
    }
    close() {
        this.x = 0,
        this.y = 0,
        this.snapTo = !0,
        this.temp = null,
        this.strokeStyle = "#000000",
        this.fillStyle = "#000000",
        this.clear();
        return null;
    }
    get lines() {
        return this.strokeStyle.match(/(#000|black|physics)+/gi) ? this._physics : this._scenery;
    }
    get physics() {
        return this._physics.map(t => t.map(t => t.toString(32)).join(" ")).join(",");
    }
    get scenery() {
        return this._scenery.map(t => t.map(t => t.toString(32)).join(" ")).join(",");
    }
    get powerups() {
        let powerups = "";
        for (const t in this._powerups) {
            switch(t) {
                case "targets":
                    for (const e of this._powerups[t]) {
                        powerups += `T ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "boosters":
                    for (const e of this._powerups[t]) {
                        powerups += `B ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "gravity":
                    for (const e of this._powerups[t]) {
                        powerups += `G ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "slowmos":
                    for (const e of this._powerups[t]) {
                        powerups += `S ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "bombs":
                    for (const e of this._powerups[t]) {
                        powerups += `O ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "checkpoints":
                    for (const e of this._powerups[t]) {
                        powerups += `C ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "antigravity":
                    for (const e of this._powerups[t]) {
                        powerups += `A ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "teleporters":
                    for (const e of this._powerups[t]) {
                        powerups += `W ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "vehicles":
                    for (const e in this._powerups[t]) {
                        for (const i of this._powerups[t][e]) {
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
}