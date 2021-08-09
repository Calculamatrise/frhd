export default class {
    constructor() {
        this.physics = [],
        this.scenery = [],
        this.powerups = {
            targets: [],
            slowmos: [],
            bombs: [],
            checkpoints: [],
            antigravity: [],
            boosters: [],
            teleporters: [],
            vehicles: {
                heli: [],
                truck: [],
                balloon: [],
                blob: []
            }
        }
        this.strokeStyle = "#000";
        this.fillStyle = "#000";
        this.snapTo = !0;
        this.x = 0;
        this.y = 0
    }
    import(c) {
        c = c.split("#");
        this.decodePhysics(c[0]);
        this.decodeScenery(c[1]);
        this.decodePowerups(c[2]);
        return this
    }
    clear() {
        this.physics = [],
        this.scenery = [],
        this.powerups = {
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
        return this
    }
    encode(i) {
        return parseInt(Math.floor(i)).toString(32)
    }
    decode(i) {
        return parseInt(parseInt(i, 32).toString())
    }
    beginPath() {
        this.x = 0;
        this.y = 0;
        return this
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        return this
    }
    lineTo(x, y) {
        this.strokeStyle == '#000' ? this.physics.push([this.x, this.y, x, y]) : this.scenery.push([this.x, this.y, x, y]);
        if (this.snapTo) {
            this.x = x;
            this.y = y;
        }
        return this
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
        return this
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
        return this
    }
    arc(x, y, radius, s) {
        var arr = [];
        if (s === void 0) s = 5;
        for(let i = 0; i <= 360; i += s) {
            arr.push(x + radius * Math.cos(i * Math.PI / 180), y + radius * Math.sin(i * Math.PI / 180))
        }
        this.strokeStyle == '#000' ? this.physics.push(arr) : this.scenery.push(arr);
        return this
    }
    circle(x, y, radius, s) {
        var arr = [];
        if (s === void 0) s = 5;
        for(let i = 0; i <= 360; i += s) {
            arr.push(x + radius * Math.cos(i * Math.PI / 180), y + radius * Math.sin(i * Math.PI / 180))
        }
        this.strokeStyle == '#000' ? this.physics.push(arr) : this.scenery.push(arr);
        return this
    }
    filledCircle(xx, yy, radius) {
        for(let y = -radius; y < radius; y++) {
            var x = 0;
            while(Math.hypot(x, y) <= radius) {
                x++
            }
            this.fillStyle == '#000' ? this.physics.push([xx - x, yy + y, xx + x, yy + y]) : this.scenery.push([xx - x, yy + y, xx + x, yy + y]);
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
        this.strokeStyle == '#000' ? this.physics.push(arr) : this.scenery.push(arr);
        return this
    }
    rect(x, y, width, h) {
        this.strokeStyle == '#000' ? this.physics.push([x, y, x + width, y, x + width, y + h, x, y + h, x, y]) : this.scenery.push([x, y, x + width, y, x + width, y + h, x, y + h, x, y]);
        return this
    }
    filledRect(x, y, width, h) {
        for (let i = y; i < y + h; i++) {
            this.fillStyle == '#000' ? this.physics.push([x, i, x + width, i]) : this.scenery.push([x, i, x + width, i]);
        }
        return this;
    }
    closePath() {
        this.lineTo(this.x, this.y);
        return this
    }
    drawStart() {
        this.moveTo(-40, 50);
        this.lineTo(40, 50);
        return this
    }
    drawTarget(x, y) {
        this.powerups.targets.push([x, y]);
        return this
    }
    drawSlowmo(x, y) {
        this.powerups.slowmos.push([x, y]);
        return this
    }
    drawBomb(x, y) {
        this.powerups.bombs.push([x, y]);
        return this
    }
    drawCheckpoint(x, y) {
        this.powerups.checkpoints.push([x, y]);
        return this
    }
    drawAntigravity(x, y) {
        this.powerups.antigravity.push([x, y]);
        return this
    }
    drawBoost(x, y, d) {
        this.powerups.boosts.push([x, y, d]);
        return this
    }
    drawGravity(x, y) {
        this.powerups.gravity.push([x, y, d]);
        return this
    }
    drawTeleport(x, y, ex, ey) {
        this.powerups.teleporters.push([x, y, ex, ey]);
        return this
    }
    drawHeli(x, y, t) {
        this.powerups.vehicles.heli.push([x, y, "1", t]);
        return this
    }
    drawTruck(x, y, t) {
        this.powerups.vehicles.truck.push([x, y, "2", t]);
        return this
    }
    drawBalloon(x, y, t) {
        this.powerups.vehicles.balloon.push([x, y, "3", t]);
        return this
    }
    drawBlob(x, y, t) {
        this.powerups.vehicles.blob.push([x, y, "4", t]);
        return this
    }
    drawVehicle(x, y, v, t) {
        v = v.toLowerCase();
        if (!["heli", "truck", "balloon", "blob"].includes(v)) return console.error(v + " IS NOT A VEHICLE");
        this.powerups.vehicles[v].push("V " + [x, y, (v == "heli" ? "1" : v == "truck" ? "2" : v == "balloon" ? "3" : v == "blob" ? "4" : ""), t]);
        return this
    }
    move(x, y) {
        for(var a in this.physics) {
            for(var i = 0; i < this.physics[a].length; i += 2) {
                this.physics[a][i] += x;
                this.physics[a][i + 1] += y;
            }
        }
        for(var a in this.scenery) {
            for(var i = 0; i < this.scenery[a].length; i += 2) {
                this.scenery[a][i] += x;
                this.scenery[a][i + 1] += y;
            }
        }
        for(var a in this.powerups) {
            switch(a) {
                case "targets":
                case "boosts":
                case "gravity":
                case "slomos":
                case "bombs":
                case "checkpoints":
                case "antigravity":
                    for(var b in this.powerups[a]) {
                        this.powerups[a][b][1] += x;
                        this.powerups[a][b][2] += y;
                    }
                    break;
                case "teleporters":
                    for(var b in this.powerups[a]) {
                        this.powerups[a][b][2] += x;
                        this.powerups[a][b][3] += y;
                    }
                    break;
                case "vehicles":
                    for(var b in this.powerups.vehicles) {
                        for(var c in this.powerups.vehicles[b]) {
                            this.powerups.vehicles[b][c][1] += x;
                            this.powerups.vehicles[b][c][2] += y;
                        }
                    }
                    break;
            }
        }
        return this
    }
    rotate(x) {
        x *= Math.PI / 180;
        for(var a in this.physics) {
            for(var i = 0; i < this.physics[a].length; i += 2) {
                let xx = this.physics[a][i];
                let yy = this.physics[a][i + 1];
                xx = xx * Math.cos(x) + yy * Math.sin(x);
                yy = yy * Math.cos(x) - xx * Math.sin(x);
                this.physics[a][i] = xx;
                this.physics[a][i + 1] = yy;
            }
        }
        for(var a in this.scenery) {
            for(var i = 0; i < this.scenery[a].length; i += 5) {
                this.scenery[a][i] += x;
                this.scenery[a][i + 2] -= x;
            }
        }
        return this
    }
    scale(x, y) {
        for(var a in this.physics) {
            for(var i = 0; i < this.physics[a].length; i += 2) {
                this.physics[a][i] += this.physics[a][i] * x;
                this.physics[a][i + 1] += this.physics[a][i + 1] * y;
            }
        }
        for(var a in this.scenery) {
            for(var i = 0; i < this.scenery[a].length; i += 2) {
                this.scenery[a][i] += this.scenery[a][i] * x;
                this.scenery[a][i + 1] += this.scenery[a][i + 1] * y;
            }
        }
        for(var a in this.powerups) {
            switch(a) {
                case "targets":
                case "boosts":
                case "gravity":
                case "slomos":
                case "bombs":
                case "checkpoints":
                case "antigravity":
                    for(var b in this.powerups[a]) {
                        this.powerups[a][b][1] += this.powerups[a][b][1] * x;
                        this.powerups[a][b][2] += this.powerups[a][b][2] * y;
                    }
                    break;
                case "teleporters":
                    for(var b in this.powerups[a]) {
                        this.powerups[a][b][2] += this.powerups[a][b][2] * x;
                        this.powerups[a][b][3] += this.powerups[a][b][3] * y;
                    }
                    break;
                case "vehicles":
                    for(var b in this.powerups.vehicles) {
                        for(var c in this.powerups.vehicles[b]) {
                            this.powerups.vehicles[b][c][1] += this.powerups.vehicles[b][c][1] * x;
                            this.powerups.vehicles[b][c][2] += this.powerups.vehicles[b][c][2] * y;
                        }
                    }
                    break;
            }
        }
        return this
    }
    decodePhysics(i) {
        var physics = i.split(",");
        this.physics = [];
        for(var a in physics) {
            var b = physics[a].split(" ");
            physics[a] = [];
            for(var c in b) {
                b[c] = this.decode(b[c]);
                physics[a].push(b[c])
            }
            this.physics.push(physics[a])
        }
        return this
    }
    decodeScenery(i) {
        var scenery = i.split(",");
        this.scenery = [];
        for(var a in scenery) {
            var b = scenery[a].split(" ");
            scenery[a] = [];
            for(var c in b) {
                b[c] = this.decode(b[c]);
                scenery[a].push(b[c])
            }
            this.scenery.push(scenery[a])
        }
        return this
    }
    decodePowerups(i) {
        var powerups = i.split(",");
        for(var p in powerups) {
            var pp = powerups[p].split(" ");
            switch(pp[0]) {
                case 'T':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.targets.push(pp.slice(1))
                    break;
                case 'S':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.slowmos.push(pp.slice(1))
                    break;
                case 'O':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.bombs.push(pp.slice(1))
                    break;
                case 'C':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.checkpoints.push(pp.slice(1))
                    break;
                case 'A':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.antigravity.push(pp.slice(1))
                    break;
                case 'B':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.boosters.push(pp.slice(1))
                    break;
                case 'G':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.gravity.push(pp.slice(1))
                    break;
                case 'W':
                    for(var i in pp) {
                        pp[i] = this.decode(pp[i])
                    }
                    this.powerups.teleporters.push(pp.slice(1))
                    break;
                case 'V':
                    switch(pp[3]) {
                        case '1':
                            for(var i in pp) {
                                pp[i] = this.decode(pp[i])
                            }
                            this.powerups.vehicles.heli.push(pp.slice(1))
                            break;
                        case '2':
                            for(var i in pp) {
                                pp[i] = this.decode(pp[i])
                            }
                            this.powerups.vehicles.truck.push(pp.slice(1))
                            break;
                        case '3':
                            for(var i in pp) {
                                pp[i] = this.decode(pp[i])
                            }
                            this.powerups.vehicles.balloon.push(pp.slice(1))
                            break;
                        case '4':
                            for(var i in pp) {
                                pp[i] = this.decode(pp[i])
                            }
                            this.powerups.vehicles.blob.push(pp.slice(1))
                            break;
                    }
                    break;
            }
        }
        return this
    }
    encodePhysics() {
        var physics = this.physics;
        this.physics = [];
        for(var a in physics) {
            var b = physics[a];
            physics[a] = [];
            for(var c in b) {
                b[c] = this.encode(b[c]);
                physics[a].push(b[c])
            }
            this.physics.push(physics[a].join(" "))
        }
        return this
    }
    encodeScenery() {
        var scenery = this.scenery;
        this.scenery = [];
        for(var a in scenery) {
            var b = scenery[a];
            scenery[a] = [];
            for(var c in b) {
                b[c] = this.encode(b[c]);
                scenery[a].push(b[c])
            }
            this.scenery.push(scenery[a].join(" "))
        }
        return this
    }
    encodePowerups() {
        var powerups = this.powerups;
        this.powerups = [];
        for(var p in powerups) {
            for(var i in powerups[p]) {
                var pi = powerups[p][i];
                powerups[p][i] = [];
                if (p == 'vehicles') {
                    for(var v in pi) {
                        powerups[p][i].push('V')
                        for(var x in pi[v]) {
                            powerups[p][i].push(this.encode(pi[v][x]))
                        }
                        this.powerups.push(powerups[p][i].join(" "))
                    }
                } else {
                    switch(p) {
                        case 'targets':
                            powerups[p][i].push('T')
                            for(var x in pi) {
                                powerups[p][i].push(this.encode(pi[x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                            break;
                        case 'slowmos':
                            powerups[p][i].push('S')
                            for(var x in pi) {
                                powerups[p][i].push(this.encode(pi[x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                            break;
                        case 'bombs':
                            powerups[p][i].push('O')
                            for(var x in pi) {
                                powerups[p][i].push(this.encode(pi[x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                            break;
                        case 'checkpoints':
                            powerups[p][i].push('C')
                            for(var x in pi) {
                                powerups[p][i].push(this.encode(pi[x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                            break;
                        case 'antigravity':
                            powerups[p][i].push('A')
                            for(var x in pi) {
                                powerups[p][i].push(this.encode(pi[x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                            break;
                        case 'boosters':
                            powerups[p][i].push('B')
                            for(var x in pi) {
                                powerups[p][i].push(this.encode(pi[x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                            break;
                        case 'teleporters':
                            powerups[p][i].push('W')
                            for(var x in pi) {
                                powerups[p][i].push(this.encode(pi[x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                            break;
                    }
                }
            }
        }
        return this
    }
    get export() {
        this.encodePhysics()
        this.encodeScenery()
        this.encodePowerups()
        return this.physics.join(",") + "#" + this.scenery.join(",") + "#" + this.powerups.join(",")
    }
}