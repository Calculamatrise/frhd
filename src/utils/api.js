export default class {
    constructor() {
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
        this.strokeStyle = "#000000";
        this.fillStyle = "#000000";
        this.snapTo = !0;
        this.x = 0;
        this.y = 0;
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
                    this._powerups.targets.push(e.slice(1).map(t => parseInt(t, 32)));
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
        this.x = x;
        this.y = y;
        return this;
    }
    lineTo(x, y) {
        this.strokeStyle.match(/(#000|black|physics)+/gi) ? this._physics.push([this.x, this.y, x, y]) : this._scenery.push([this.x, this.y, x, y]);
        if (this.snapTo) {
            this.x = x;
            this.y = y;
        }
        return this;
    }
    curveTo(p1x, p1y, p2x, p2y) {
        var p0 = {x: this.x, y: this.y},
            p1 = {x: p1x, y: p1y},
            p2 = {x: p2x, y: p2y};
        for(let i = 0; i < 1; i+=1/10) {
            var x = Math.pow((1 - i), 2) * p0.x + 2 * (1 - i) * i * p1.x + Math.pow(i, 2) * p2.x;
            var y = Math.pow((1 - i), 2) * p0.y + 2 * (1 - i) * i * p1.y + Math.pow(i, 2) * p2.y;
            this.lineTo(x, y)
        }
        return this;
    }
    bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y) {
        var p0 = {x: this.x, y: this.y},
            p1 = {x: p1x, y: p1y},
            p2 = {x: p2x, y: p2y},
            p3 = {x: p3x, y: p3y};
        for(let i = 0; i < 1; i+=1/10) {
            var cX = 3 * (p1.x - p0.x),
                bX = 3 * (p2.x - p1.x) - cX,
                aX = p3.x - p0.x - cX - bX;
    
            var cY = 3 * (p1.y - p0.y),
                bY = 3 * (p2.y - p1.y) - cY,
                aY = p3.y - p0.y - cY - bY;
    
            var x = (aX * Math.pow(i, 3)) + (bX * Math.pow(i, 2)) + (cX * i) + p0.x;
            var y = (aY * Math.pow(i, 3)) + (bY * Math.pow(i, 2)) + (cY * i) + p0.y;
            this.lineTo(x, y)
        }
        return this;
    }
    arc(x, y, radius, s) {
        var arr = [];
        if (s === void 0) s = 5;
        for(let i = 0; i <= 360; i += s) {
            arr.push(x + radius * Math.cos(i * Math.PI / 180), y + radius * Math.sin(i * Math.PI / 180))
        }
        this.strokeStyle.match(/(#000|black|physics)+/gi) ? this._physics.push(arr) : this._scenery.push(arr);
        return this;
    }
    circle(x, y, radius, s) {
        var arr = [];
        if (s === void 0) s = 5;
        for(let i = 0; i <= 360; i += s) {
            arr.push(x + radius * Math.cos(i * Math.PI / 180), y + radius * Math.sin(i * Math.PI / 180))
        }
        this.strokeStyle.match(/(#000|black|physics)+/gi) ? this._physics.push(arr) : this._scenery.push(arr);
        return this;
    }
    filledCircle(xx, yy, radius) {
        for(let y = -radius; y < radius; y++) {
            var x = 0;
            while(Math.hypot(x, y) <= radius) {
                x++
            }
            this.fillStyle.match(/(#000|black|physics)+/gi) ? this._physics.push([xx - x, yy + y, xx + x, yy + y]) : this._scenery.push([xx - x, yy + y, xx + x, yy + y]);
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
        this.strokeStyle.match(/(#000|black|physics)+/gi) ? this._physics.push(arr) : this._scenery.push(arr);
        return this;
    }
    rect(x, y, width, h) {
        this.strokeStyle.match(/(#000|black|physics)+/gi) ? this._physics.push([x, y, x + width, y, x + width, y + h, x, y + h, x, y]) : this._scenery.push([x, y, x + width, y, x + width, y + h, x, y + h, x, y]);
        return this;
    }
    filledRect(x, y, width, h) {
        for (let i = y; i < y + h; i++) {
            this.fillStyle.match(/(#000|black|physics)+/gi) ? this._physics.push([x, i, x + width, i]) : this._scenery.push([x, i, x + width, i]);
        }
        return this;
    }
    closePath() {
        let [ x, y ] = this[this.fillStyle.match(/(#000|black|physics)+/gi) ? "_physics" : "_scenery"][0];
        this.lineTo(x, y);
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
    drawVehicle(x, y, v, t) {
        v = v.toLowerCase();
        if (!this._powerups.vehicles[v]) throw new Error("INVALID_VEHICLE");
        this._powerups.vehicles[v].push("V " + [x, y, (v == "heli" ? 1 : v == "truck" ? 2 : v == "balloon" ? 3 : v == "blob" ? 4 : v == "glider" ? 5 : ""), t]);
        return this;
    }
    move(x, y) {
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
    rotate(x) {
        x *= Math.PI / 180;
        for(var a in this._physics) {
            for(var i = 0; i < this._physics[a].length; i += 2) {
                let xx = this._physics[a][i];
                let yy = this._physics[a][i + 1];
                xx = xx * Math.cos(x) + yy * Math.sin(x);
                yy = yy * Math.cos(x) - xx * Math.sin(x);
                this._physics[a][i] = xx;
                this._physics[a][i + 1] = yy;
            }
        }
        for(var a in this._scenery) {
            for(var i = 0; i < this._scenery[a].length; i += 5) {
                this._scenery[a][i] += x;
                this._scenery[a][i + 2] -= x;
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
        return this;
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