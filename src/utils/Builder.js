import RequestHandler from "./RequestHandler.js";

import { PNG } from "pngjs";
import Image from "./Image.js";

const position = {
    x: null,
    y: null
}

const initialPosition = {
    x: null,
    y: null
}

let cache = {}

export default class {
    /**
     * 
     * @param {String} URI image location or URI
     */
    static image(URI) {
        const image = new Image();

        image.src = URI;

        return new Promise(function(resolve, reject) {
            image.addEventListener("load", function(image) {
                resolve(image);
            });
        });
    }
    
    /**
     * @private
     */
    #fillStyle = "#000000";
    get fillStyle() {
        return this.#fillStyle;
    }
    /**
     * @param {String} value
     */
    set fillStyle(value) {
        if (value.match(/^(#([a-f0-9]{3,4}|[a-f0-9]{6,8})|rgba?\((\d+(,\s+)?){3,4}\))$/gi)) {
            throw new Error("INVALID VALUE");
        }

        this.#fillStyle = value;
    }

    /**
     * @private
     */
    #font = "10px sans-serif";
    get font() {
        return this.#font;
    }
    /**
     * @param {String} value
     */
    set font(value) {
        // 10px Arial
        this.#font = value;
    }

    /**
     * @private
     */
    #globalCompositeOperation = "source-over";
    get globalCompositeOperation() {
        return this.#globalCompositeOperation;
    }
    /**
     * @param {String} value
     */
    set globalCompositeOperation(value) {
        this.#globalCompositeOperation = value;
    }

    /**
     * @private
     */
    #lineDash = [];

    /**
     * @private
     */
    #lineDashOffset = 0;
    get lineDashOffset() {
        return this.#lineDashOffset;
    }
    /**
     * @param {Number|String} value
     */
    set lineDashOffset(value) {
        if (isNaN(parseInt(value))) {
            throw new Error("INVALID VALUE");
        }

        this.#lineDashOffset = parseInt(value);
    }
 
    /**
     * @private
     */
    #lineWidth = 1;
    get lineWidth() {
        return this.#lineWidth;
    }
    /**
     * @param {Number|String} value
     */
    set lineWidth(value) {
        if (isNaN(parseInt(value))) {
            throw new Error("INVALID VALUE");
        }

        this.#lineWidth = parseInt(value);
    }

    /**
     * @private
     */
    #strokeStyle = "#000000";
    get strokeStyle() {
        return this.#strokeStyle;
    }
    /**
     * @param {String} value
     */
    set strokeStyle(value) {
        if (value.match(/^(#[a-f0-9]{3,4}|#[a-f0-9]{6,8}|rgba?\((\d+(,\s+)?){3,4}\))/gi)) {
            throw new Error("INVALID VALUE");
        }

        this.#strokeStyle = value;
    }

    /**
     * @private
     */
    #textAlign = "start";
    get textAlign() {
        return this.#textAlign;
    }
    /**
     * @param {String} value
     */
    set textAlign(value) {
        this.#textAlign = value;
    }

    /**
     * @private
     */
    #textBaseline = "start";
    get textBaseline() {
        return this.#textBaseline;
    }
    /**
     * @param {String} value
     */
    set textBaseline(value) {
        this.#textBaseline = value;
    }

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
    #segment = []
    get lines() {
        return this.#strokeStyle.match(/(#000|black|rgba?\((0(,(\s+)?)?){3,4}\))+/gi) ? this.#physics : this.#scenery;
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

    /**
     * 
     * @param {Number|String} x position x
     * @param {Number|String} y position y
     * @param {Number|String} radius radius of the arc
     * @param {Number|String} startAngle angle in radians
     * @param {Number|String} endAngle angle in radians
     * @param {boolean} counterClockwise decide the direction at which the arc is drawn
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

        position.x = points[points.length - 2];
        position.y = points[points.length - 1];

        this.#segment.push(points);

        return this;
    }

    /**
     * 
     * @param {Number|String} cpx position x of the control point
     * @param {Number|String} cpy position y of the control point
     * @param {Number|String} x position x of the end point
     * @param {Number|String} y position y of the end point
     * @param {Number|String} radius radius of the arc
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

        const p0 = { x: position.x + (parseFloat(cpx) - position.x) - parseFloat(radius), y: position.y }
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
    
    beginPath() {
        position.x = 0;
        position.y = 0;

        return this;
    }

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

        const p0 = { x: position.x, y: position.y }
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
     * @param {Number|String} x rectangle clip position along the x-axis
     * @param {Number|String} y rectangle clip position along the y-axis
     * @param {Number|String} width clip rectangle width
     * @param {Number|String} height clip rectangle height
     */
    clearRect(x, y, width, height) {
        // Remove all lines between x and width AND y and height. Maybe use Math.abs
    }

    clip() {}

    closePath() {
        // if (initialPosition.x ?? initialPosition.y ?? true) {
        //     return;
        // }

        // this.lineTo(initialPosition.x, initialPosition.y);

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

    createImageData() {
        return new this.constructor();
    }

    /**
     * 
     * @param {Image} image instance of Image constructor
     * @param {Number|String} sx source image position along the x-axis
     * @param {Number|String} sy source image position along the y-axis
     * @param {Number|String} sWidth source image width
     * @param {Number|String} sHeight source image height
     * @param {Number|String} dx source image destination along the x-axis
     * @param {Number|String} dy source image destination along the y-axis
     * @param {Number|String} dWidth destination image width
     * @param {Number|String} dHeight destination image height
     * @returns {Builder} this
     */
    drawImage(image, sx = 0, sy = 0, sWidth, sHeight, dx = 0, dy = 0, dWidth, dHeight) {
        if (!(image instanceof Image)) {
            throw new Error("Invalid Image");
        }

        const pixels = {
            data: image.data,
            width: dWidth,
            height: dHeight
        }

        if (arguments.length > 5) {
            pixels.data = pixels.data.slice(4 * image.width  * parseInt(sy), -(4 * image.width * image.height - 4 * image.width * parseInt(sHeight)));
            pixels.data = pixels.data.filter((item, index) => index % (image.width * 4) >= (parseInt(sx) * 4) && index % (image.width * 4) < (parseInt(sWidth) * 4));
            pixels.height -= parseInt(sy);
            pixels.width -= parseInt(sx);
        }

        for (let t = 0, e = 0; t in pixels.data; t += 4) {
            e = pixels.data[t] * .2 + pixels.data[t + 1] * .7 + pixels.data[t + 2] * .1;
            pixels.data[t] = pixels.data[t + 1] = pixels.data[t + 2] = e <= 85 ? 0 : e <= 170 ? 170 : 255;
        }

        for (let y = 0, iy; y <= pixels.height; y++) {
            for (let x = 0, ix, dxt, e; x <= pixels.width; x++) {
                e = (x + y * pixels.width) * 4;
                ix = x * 2 + parseInt(arguments.length > 5 ? dx : sx);
                iy = y * 2 + parseInt(arguments.length > 5 ? dy : sy);
                dxt = ix + 2;

                if (pixels.data[e] === 255 || pixels.data[e - 4] === pixels.data[e] && Math.floor((e - 4) / pixels.width / 4) === y) continue;
                for (let i = x + 1, s; i <= pixels.width; i++) {
                    s = (i + y * pixels.width) * 4;
                    if (i >= pixels.width - 1 || pixels.data[s] != pixels.data[e]) {
                        dxt = (i - 1) * 2 + parseInt(arguments.length > 5 ? dx : sx);
                        break;
                    }
                }

                if (pixels.data[e] == 0) {
                    this.#physics.push([ix, iy, dxt, iy], [ix, iy + 2, dxt, iy + 2]);
                } else {
                    this.#scenery.push([ix, iy, dxt, iy], [ix, iy + 2, dxt, iy + 2]);
                }
            }
        }

        return this;
    }

    /**
     * 
     * @param {Number|String} x 
     * @param {Number|String} y 
     * @param {Number|String} radiusX 
     * @param {Number|String} radiusY 
     * @param {Number|String} rotation 
     */
    ellipse(x, y, radiusX, radiusY, rotation) {}

    fill() {
        this.lines.push(...this.#segment);

        this.#segment = []

        return this;
    }

    /**
     * 
     * @param {Number|String} x position of the rectangle along the x-axis
     * @param {Number|String} y position of the rectangle along the y-axis
     * @param {Number|String} width width of the rectangle
     * @param {Number|String} height height of the rectangle
     */
    fillRect(x, y, width, height) {
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

    /**
     * 
     * @param {String} content 
     * @param {Number|String} x 
     * @param {Number|String} y 
     */
    fillText(content, x, y) {}

    getImageData() {
        return this.code;
    }

    getLineDash() {
        return this.#lineDash.split(/\s+/g);
    }

    /**
     * 
     * @param {Number|String} x position x of the end point
     * @param {Number|String} y position y of the end point
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
            position.x, position.y,
            parseFloat(x), parseFloat(y)
        ]);
        
        position.x = parseFloat(x);
        position.y = parseFloat(y);

        return this;
    }

    /**
     * 
     * @param {String} text 
     */
    measureText(text) {
        return {
            width: text.length * parseFloat(this.font),
            height: parseFloat(this.font),
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 0
        }
    }

    /**
     * 
     * @param {Number|String} x position x of the starting point
     * @param {Number|String} y position y of the starting point
     * @returns object
     */
    moveTo(x, y) {
        for (const argument of arguments) {
            if (isNaN(parseFloat(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        position.x = parseFloat(x);
        position.y = parseFloat(y);

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

    putImageData(data) {
        this.import(data);
        // Replace image data with new data
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

        const p0 = { x: position.x, y: position.y }
        const p1 = { x: parseFloat(p1x), y: parseFloat(p1y) }
        const p2 = { x: parseFloat(p2x), y: parseFloat(p2y) }
        for (let i = 0; i < 1; i += 1 / 10) {
            this.lineTo(Math.pow((1 - i), 2) * p0.x + 2 * (1 - i) * i * p1.x + Math.pow(i, 2) * p2.x, Math.pow((1 - i), 2) * p0.y + 2 * (1 - i) * i * p1.y + Math.pow(i, 2) * p2.y);
        }

        return this;
    }

    /**
     * 
     * @param {Number|String} x 
     * @param {Number|String} y 
     * @param {Number|String} width 
     * @param {Number|String} height 
     * @returns 
     */
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

    restore() {
        for (const property in cache) {
            if (property === "position") {
                position.x = cache[property].x
                position.y = cache[property].y

                continue;
            } else if (property === "initialPosition") {
                initialPosition.x = cache[property].x
                initialPosition.y = cache[property].y
                
                continue;
            }
            
            if (cache.hasOwnProperty(property)) {
                this[property] = cache[property];
            }
        }
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

    save() {
        cache = {
            fillStyle: this.fillStyle,
            font: this.#font,
            globalCompositeOperation: this.#globalCompositeOperation,
            lineDash: this.#lineDash,
            lineDashOffset: this.#lineDashOffset,
            lineWidth: this.#lineWidth,
            strokeStyle: this.#strokeStyle,
            textAlign: this.#textAlign,
            textBaseline: this.#textBaseline,
            // transform: this.#transform,
            initialPosition,
            position
        }
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

    setLineDash(...args) {
        this.#lineDash = args.join(" ");
    }

    stroke() {
        this.lines.push(...this.#segment);

        this.#segment = []

        return this;
    }

    /**
     * 
     * @deprecated this method may be removed in the near future
     * @param {Number|String} x position x of the starting point
     * @param {Number|String} y position y of the starting point
     * @param {Number|String} x2 position x of the end point
     * @param {Number|String} y2 position y of the end point
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
     * @param {Number|String} x 
     * @param {Number|String} y 
     * @param {Number|String} width 
     * @param {Number|String} height 
     * @returns 
     */
    strokeRect(x, y, width, height) {
        for (const argument of arguments) {
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.lines.push([
            x, y,
            x + width, y,
            x + width, y + height,
            x, y + height,
            x, y
        ]);
        
        return this;
    }

    /**
     * 
     * @throws this method is incomplete.
     * @param {String} content 
     * @param {Number|String} x 
     * @param {Number|String} y 
     */
    strokeText(content, x, y) {
        throw new Error("Incomplete method.");

        const size = parseInt(this.font.replace(/^\D+/gi, ""));
        for (const character of content) {
            let position = {
                get x() {
                    return content.length * size + x + content.indexOf(character) * size * 2.5;
                },
                get y() {
                    return y;
                }
            }

            this.save();
            this.beginPath();
            alphabet[character](this, position, size);
            this.stroke();
            this.restore();
        }
    }
    
    star(x, y) {
        this.#powerups.targets.push([x, y]);

        return this;
    }

    boost(x, y, d) {
        this.#powerups.boosts.push([x, y, d]);

        return this;
    }

    gravity(x, y) {
        this.#powerups.gravity.push([x, y, d]);

        return this;
    }

    slowmo(x, y) {
        this.#powerups.slowmos.push([x, y]);

        return this;
    }

    bomb(x, y) {
        this.#powerups.bombs.push([x, y]);

        return this;
    }

    checkpoint(x, y) {
        this.#powerups.checkpoints.push([x, y]);

        return this;
    }

    antigravity(x, y) {
        this.#powerups.antigravity.push([x, y]);

        return this;
    }

    teleport(x, y, ex, ey) {
        this.#powerups.teleporters.push([x, y, ex, ey]);

        return this;
    }

    heli(x, y, t) {
        this.#powerups.vehicles.heli.push([x, y, 1, t]);

        return this;
    }

    truck(x, y, t) {
        this.#powerups.vehicles.truck.push([x, y, 2, t]);

        return this;
    }

    balloon(x, y, t) {
        this.#powerups.vehicles.balloon.push([x, y, 3, t]);

        return this;
    }

    blob(x, y, t) {
        this.#powerups.vehicles.blob.push([x, y, 4, t]);

        return this;
    }

    translate(x = 0, y = 0) {
        // translate canvas to reposition the origin

        return this;
    }

    /**
     * 
     * @deprecated this method will be removed in the next version.
     */
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
        
        return this;
    }
}