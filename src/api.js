const https = require('https');
function request(m, p, b, callback = () => {}, url, f) {
    let options = {
        hostname: url ? url : 'www.freeriderhd.com',
        port: 443,
        path: p,
        method: m,
        headers: m == 'POST' ? {
            'Content-Type': 'application/x-www-form-urlencoded',
            'carset': 'UTF-8'
        } : {
            'Content-Type': 'application/json; charset=utf-8'
        }
    },
    err;
    const req = https.request(options, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', data => body += data);
        res.on('end', () => {
            callback(err, body)
        });
    });
    req.on('error', e => err = e);
    if(b != void 0){
        req.write(url ? b : `${b}&ajax=!0&t_1=ref&t_2=desk`);
    }
    req.end();
}
module.exports = {
    getHome: function(callback = () => {}){
        request('GET', '', (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            callback(d);
        });
    },
    getPlayerLB: function(page, callback = () => {}){
        request('GET', `/leaderboards/player/lifetime/${page}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.player) return callback(`Page "${page}" does not exist`);
            callback(d);
        });
    },
    getAuthorLB: function(page, callback = () => {}){
        request('GET', `/leaderboards/author/lifetime/${page}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.author) return callback(`Page "${page}" does not exist`);
            callback(d);
        });
    },
    getCategory: function(category, callback = () => {}){
        request('GET', `/${category}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.tracks) return callback(`No category by the name of "${d.user.u_name}"`);
            callback(d);
        });
    },
    getUser: function(u, callback = () => {}){
        request('GET', `/u/${u}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.user) return callback(`No user by the name of "${u}"`);
            callback(d);
        });
    },
    getTrack: function(t, callback = () => {}){
        request('GET', `/t/${t}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.track) return callback(`No track by the id "${t}"`);
            callback(d);
        });
    },
    getRandom: function(callback = () => {}){
        request('GET', `/random/track?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            callback(d);
        });
    },
    getFeaturedGhosts: function(callback = () => {}){
        request('GET', `/Calculus0972/Official_Featured_Ghosts/master/ghosts.json`, void 0, (err, d) => {
            if(err) return callback(err);
            callback(JSON.parse(d));
        }, 'raw.githubusercontent.com');
    },
    User: class {
        constructor(){
            this.token = null;
            this.activity_time_ago = null;
        }
        login(token){
            this.token = token;
        }
        logout(){
            this.token = null;
            this.user = null;
        }
        defaultLogin(u, p){
            request('POST', `auth/standard_login`, `login=${u}&password=${p}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                d = JSON.parse(d);
                this.user = d.user;
                callback(d);
            });
        }
        verifyLogin(callback = () => {}) {
            if(!this.token) return console.error('You are not logged in');
            request('GET', `/?ajax=!0&app_signed_request=${this.token}`, void 0, (err, d) => {
                if(err) return callback(err);
                d = JSON.parse(d);
                this.user = d.user;
                callback(d);
            });
        }
        getUser(u, callback = () => {}){
            request('GET', `/u/${u}?ajax=!0`, void 0, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                if(!d.user) return callback(`No user by the name of "${u}"`);
                callback(d);
            });
        }
        getMyUser(callback = () => {}){
            if(!this.token) return callback('You are not logged in');
            this.verifyLogin(d => {
                if(!d) return callback("Error");
                this.getUser(this.user.d_name, d => {
                    this.user = d.user;
                    callback(d);
                });
            });
        }
        getTrack(t, callback = () => {}){
            request('GET', `/t/${t}?ajax=!0`, void 0, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                if(!d.track) return callback(`No track by the id "${t}"`);
                callback(d);
            });
        }
        getNotifications(callback = () => {}) {
            if(!this.token) return callback('You are not logged in');
            request('GET', `/notifications?ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`, void 0, (err, d) => {
                if(err) return callback(err);
                callback(JSON.parse(d));
            });
        }
        getComment(t, c, callback = () => {}) {
            if(!t || !c) return callback('False arguments');
            this.getTrack(t, d => {
                for(var i in d.track_comments){
                    if(d.track_comments[i].comment.id == c){
                        callback(d.track_comments[i])
                    }
                }
            });
        }
        datapoll(callback = () => {}){
            if(!this.token) return callback('You are not logged in');
            request('POST', '/datapoll/poll_request', `notifications=true&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeName(n, callback = () => {}) {
            if(!n) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/account/edit_profile', `name=u_name&value=${encodeURIComponent(n.replace(/[^A-Z0-9]/ig, ""))}&app_signed_request=${this.token}`, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeDesc(d, callback = () => {}) {
            if(!d) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/account/edit_profile', `name=about&value=${encodeURIComponent(d).replace('%20', '+')}&app_signed_request=${this.token}`, (err, x) => {
                x = JSON.parse(x);
                if (err) return callback(err);
                this.user = x.user;
                callback(x);
            });
        }
        changePassword(o, n, callback = () => {}) {
            if(!n || !o) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/account/change_password', `old_password=${encodeURIComponent(o).replace('%20', '+')}&new_password=${encodeURIComponent(n).replace('%20', '+')}&app_signed_request=${this.token}`, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeForumsPassword(p, callback = () => {}) {
            if(!p) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/account/update_forum_account', `password=${encodeURIComponent(p).replace('%20', '+')}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        buyHead(callback = () => {}) {
            if(!this.token) return callback('You are not logged in');
            request('POST', '/store/buy', (err, d) => {
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        equipHead(h, callback = () => {}) {
            if(!h) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/store/equip', `item_id=${h}`,(err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        addFriend(f, callback = () => {}) {
            if(!this.token) return callback('You are not logged in');
            request('POST', '/friends/send_friend_request', `u_name=${f}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        removeFriend(i, callback = () => {}){
            if(!this.token) return callback('You are not logged in');
            request('POST', '/friends/remove_friend', `u_id=${i}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        acceptFriend(i, callback = () => {}){
            if(!this.token) return callback('You are not logged in');
            request('POST', '/friends/respond_to_friend_request', `u_id=${i}&action=accept&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        challenge(u, m, t, callback = () => {}){
            if(!u || !m || !t) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/challenge/send', `users%5B%5D=${u.join("&users%5B%5D=")}&msg=${m}&track_slug=${t}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                callback(d);
            });
        }
        comment(t, m, callback = () => {}){
            if(!t || !m) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/track_comments/post', `t_id=${t}&msg=${encodeURIComponent(m).replace('%20', '+')}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                callback(d);
            });
        }
        vote(t, v, callback = () => {}){
            if(!t || !v) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/track_api/vote', `t_id=${tId}&vote=${vote}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                callback(d);
            });
        }
        subscribe(i, callback = () => {}) {
            if(!i) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/track_api/subscribe', `sub_uid=${i}&subscribe=1&app_signed_request=${this.token}`, (err, x) => {
                if(err) return callback(err);
                callback(x);
            });
        }
        redeemCoupon(c, callback = () => {}) {
            if(!c) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', '/store/redeemCouponCode', `coupon_code=${c}&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                callback(d);
            });
        }
        signup(u, e, p, callback = () => {}) {
            if(!u || !e || !p) return callback('False arguments');
            request('POST', '/auth/standard_signup', `username=${encodeURIComponent(u)}&email=${encodeURIComponent(e).replace('%20', '+')}&password=${encodeURIComponent(p).replace('%20', '+')}&recaptcha=03AGdBq252AkaYfc0P6E9u_GQq4aruILoiMcMMMZgxXfGKa-Y2nASs5BEjB-df6V6fSyYuBG8xs4nlcwb5ASfsJL98W1Pq2HUXyR5QyFT-FgZ8ljubncpwK92q5XKnaXWthEfbA0EvH1qV2Rh4a6WQSpoo01kgteHf5C3dvK6c8rhM1nZThunHUNAgld1_AljlDS7cYXGsPSAdLXOFcMwz_TtcliBTei_f3TiQTasfNIFWfrgdWCyWSARj5LGbrciLS_-65cgoMbuh9rSLqOAduwn_RCcVoteCX6RlfVT3DPsVr1v7uJseYuTvgrVGpsrrrBx87O3pO_n0zGnRZpYU65qfx8Z7hjVvrohuvJgmDE7qtDsshmsmwo-OiJ0yc5WwRV2m63XrC9I-1JA8ZjAGg5xhPhh0NkCAQrMKSkUrkdgPg2VpEc9ZJZalUOdex8GpzDQ23gwqmh_gknLC2dhr8C5QpFCLfIl8eA&app_signed_request=${this.token}`, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                this.user = d.user;
                this.token = d.app_signed_request;
                callback(d)
            });
        }
        publish(n, d, v, m, b, c, callback = () => {}) {
            if(!this.token) return callback('You are not logged in');
            request('POST', '/create/submit', `name=${encodeURIComponent(n).replace('%20', '+')}&desc=${encodeURIComponent(d).replace('%20', '+')}&default_vehicle=${v}&allowed_vehicles%5BMTB%5D=${m}&allowed_vehicles%5BBMX%5D=${b}&code=${encodeURIComponent(c).replace('%20', '+')}&app_signed_request=${this.token}`, (err, x) => {
                if(err) return callback(err);
                this.user = x.user;
                callback(x);
            });
        }
    },
    Track: class {
        constructor(){
            this.black = [],
            this.grey = [],
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
        }
        import(c){
            c = c.split("#");
            this.decodePhysics(c[0])
            this.decodeScenery(c[1])
            this.decodePowerups(c[2])
        }
        clear(){
            this.black = [],
            this.grey = [],
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
        }
        encode(i){
            return parseInt(Math.floor(i)).toString(32)
        }
        decode(i){
            return parseInt(parseInt(i, 32).toString());
        }
        drawLine(t, x, y, ex, ey){
            switch(t){
                case "b":
                case "black":
                case "p":
                case "physics":
                    this.black.push([x, y, ex, ey]);
                    break;
                case "g":
                case "grey":
                case "gray":
                case "s":
                case "scenery":
                    this.grey.push([x, y, ex, ey]);
                    break;
                default:
                    return console.error(t + " is not a line type.")
            }
        }
        drawPhysicsLine(x, y, ex, ey){
            this.black.push([x, y, ex, ey])
        }
        drawSceneryLine(x, y, ex, ey){
            this.grey.push([x, y, ex, ey])
        }
        drawStart(){
            this.drawPhysicsLine(-40, 50, 40, 50)
        }
        drawTarget(x, y){
            this.powerups.targets.push([x, y]);
        }
        drawSlowmo(x, y){
            this.powerups.slowmos.push([x, y])
        }
        drawBomb(x, y){
            this.powerups.bombs.push([x, y]);
        }
        drawCheckpoint(x, y){
            this.powerups.checkpoints.push([x, y])
        }
        drawAntigravity(x, y){
            this.powerups.antigravity.push([x, y]);
        }
        drawBoost(x, y, d){
            this.powerups.boosts.push([x, y, d])
        }
        drawGravity(x, y){
            this.powerups.gravity.push([x, y, d]);
        }
        drawTeleport(x, y, ex, ey){
            this.powerups.teleporters.push([x, y, ex, ey])
        }
        drawHeli(x, y, t){
            this.powerups.vehicles.heli.push([x, y, "1", t])
        }
        drawTruck(x, y, t){
            this.powerups.vehicles.truck.push([x, y, "2", t])
        }
        drawBalloon(x, y, t){
            this.powerups.vehicles.balloon.push([x, y, "3", t])
        }
        drawBlob(x, y, t){
            this.powerups.vehicles.blob.push([x, y, "4", t])
        }
        drawVehicle(x, y, v, t){
            v = v.toLowerCase();
            if(!["heli", "truck", "balloon", "blob"].includes(v)) return console.error(v + " IS NOT A VEHICLE");
            this.powerups.vehicles[v].push("V " + [x, y, (v == "heli" ? "1" : v == "truck" ? "2" : v == "balloon" ? "3" : v == "blob" ? "4" : ""), t])
        }
        move(x, y){
            for(var a in this.black){
                for(var i = 0; i < this.black[a].length; i += 2){
                    this.black[a][i] += x;
                    this.black[a][i + 1] += y;
                }
            }
            for(var a in this.grey){
                for(var i = 0; i < this.grey[a].length; i += 2){
                    this.grey[a][i] += x;
                    this.grey[a][i + 1] += y;
                }
            }
            for(var a in this.powerups){
                switch(a){
                    case "targets":
                    case "boosts":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        for(var b in this.powerups[a]){
                            this.powerups[a][b][1] += x;
                            this.powerups[a][b][2] += y;
                        }
                        break;
                    case "teleporters":
                        for(var b in this.powerups[a]){
                            this.powerups[a][b][2] += x;
                            this.powerups[a][b][3] += y;
                        }
                        break;
                    case "vehicles":
                        for(var b in this.powerups.vehicles){
                            for(var c in this.powerups.vehicles[b]){
                                this.powerups.vehicles[b][c][1] += x;
                                this.powerups.vehicles[b][c][2] += y;
                            }
                        }
                        break;
                }
            }
        }
        rotate(x){
            x *= Math.PI / 180;
            for(var a in this.black){
                for(var i = 0; i < this.black[a].length; i += 2){
                    let xx = this.black[a][i];
                    let yy = this.black[a][i + 1];
                    xx = xx * Math.cos(x) + yy * Math.sin(x);
                    yy = yy * Math.cos(x) - xx * Math.sin(x);
                    this.black[a][i] = xx;
                    this.black[a][i + 1] = yy;
                }
            }
            for(var a in this.grey){
                for(var i = 0; i < this.grey[a].length; i += 5){
                    this.grey[a][i] += x;
                    this.grey[a][i + 2] -= x;
                }
            }
        }
        scale(x, y){
            for(var a in this.black){
                for(var i = 0; i < this.black[a].length; i += 2){
                    this.black[a][i] += this.black[a][i] * x;
                    this.black[a][i + 1] += this.black[a][i + 1] * y;
                }
            }
            for(var a in this.grey){
                for(var i = 0; i < this.grey[a].length; i += 2){
                    this.grey[a][i] += this.grey[a][i] * x;
                    this.grey[a][i + 1] += this.grey[a][i + 1] * y;
                }
            }
            for(var a in this.powerups){
                switch(a){
                    case "targets":
                    case "boosts":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        for(var b in this.powerups[a]){
                            this.powerups[a][b][1] += this.powerups[a][b][1] * x;
                            this.powerups[a][b][2] += this.powerups[a][b][2] * y;
                        }
                        break;
                    case "teleporters":
                        for(var b in this.powerups[a]){
                            this.powerups[a][b][2] += this.powerups[a][b][2] * x;
                            this.powerups[a][b][3] += this.powerups[a][b][3] * y;
                        }
                        break;
                    case "vehicles":
                        for(var b in this.powerups.vehicles){
                            for(var c in this.powerups.vehicles[b]){
                                this.powerups.vehicles[b][c][1] += this.powerups.vehicles[b][c][1] * x;
                                this.powerups.vehicles[b][c][2] += this.powerups.vehicles[b][c][2] * y;
                            }
                        }
                        break;
                }
            }
        }
        decodePhysics(i){
            var black = i.split(",");
            this.black = [];
            for(var a in black){
                var b = black[a].split(" ");
                black[a] = [];
                for(var c in b){
                    b[c] = this.decode(b[c]);
                    black[a].push(b[c])
                }
                this.black.push(black[a])
            }
        }
        decodeScenery(i){
            var grey = i.split(",");
            this.grey = [];
            for(var a in grey){
                var b = grey[a].split(" ");
                grey[a] = [];
                for(var c in b){
                    b[c] = this.decode(b[c]);
                    grey[a].push(b[c])
                }
                this.grey.push(grey[a])
            }
        }
        decodePowerups(i){
            var powerups = i.split(",");
            for(var p in powerups){
                var pp = powerups[p].split(" ");
                switch(pp[0]){
                    case 'T':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.targets.push(pp.slice(1))
                        break;
                    case 'S':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.slowmos.push(pp.slice(1))
                        break;
                    case 'O':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.bombs.push(pp.slice(1))
                        break;
                    case 'C':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.checkpoints.push(pp.slice(1))
                        break;
                    case 'A':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.antigravity.push(pp.slice(1))
                        break;
                    case 'B':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.boosters.push(pp.slice(1))
                        break;
                    case 'G':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.gravity.push(pp.slice(1))
                        break;
                    case 'W':
                        for(var i in pp){
                            pp[i] = this.decode(pp[i])
                        }
                        this.powerups.teleporters.push(pp.slice(1))
                        break;
                    case 'V':
                        switch(pp[3]){
                            case '1':
                                for(var i in pp){
                                    pp[i] = this.decode(pp[i])
                                }
                                this.powerups.vehicles.heli.push(pp.slice(1))
                                break;
                            case '2':
                                for(var i in pp){
                                    pp[i] = this.decode(pp[i])
                                }
                                this.powerups.vehicles.truck.push(pp.slice(1))
                                break;
                            case '3':
                                for(var i in pp){
                                    pp[i] = this.decode(pp[i])
                                }
                                this.powerups.vehicles.balloon.push(pp.slice(1))
                                break;
                            case '4':
                                for(var i in pp){
                                    pp[i] = this.decode(pp[i])
                                }
                                this.powerups.vehicles.blob.push(pp.slice(1))
                                break;
                        }
                        break;
                }
            }
        }
        encodePhysics(){
            var black = this.black;
            this.black = [];
            for(var a in black){
                var b = black[a];
                black[a] = [];
                for(var c in b){
                    b[c] = this.encode(b[c]);
                    black[a].push(b[c])
                }
                this.black.push(black[a].join(" "))
            }
        }
        encodeScenery(){
            var grey = this.grey;
            this.grey = [];
            for(var a in grey){
                var b = grey[a];
                grey[a] = [];
                for(var c in b){
                    b[c] = this.encode(b[c]);
                    grey[a].push(b[c])
                }
                this.grey.push(grey[a].join(" "))
            }
        }
        encodePowerups(){
            var powerups = this.powerups;
            this.powerups = [];
            for(var p in powerups){
                for(var i in powerups[p]){
                    var pi = powerups[p][i];
                    powerups[p][i] = [];
                    if(p == 'vehicles'){
                        for(var v in pi){
                            powerups[p][i].push('V')
                            for(var x in pi[v]){
                                powerups[p][i].push(this.encode(pi[v][x]))
                            }
                            this.powerups.push(powerups[p][i].join(" "))
                        }
                    } else {
                        switch(p){
                            case 'targets':
                                powerups[p][i].push('T')
                                for(var x in pi){
                                    powerups[p][i].push(this.encode(pi[x]))
                                }
                                this.powerups.push(powerups[p][i].join(" "))
                                break;
                            case 'slowmos':
                                powerups[p][i].push('S')
                                for(var x in pi){
                                    powerups[p][i].push(this.encode(pi[x]))
                                }
                                this.powerups.push(powerups[p][i].join(" "))
                                break;
                            case 'bombs':
                                powerups[p][i].push('O')
                                for(var x in pi){
                                    powerups[p][i].push(this.encode(pi[x]))
                                }
                                this.powerups.push(powerups[p][i].join(" "))
                                break;
                            case 'checkpoints':
                                powerups[p][i].push('C')
                                for(var x in pi){
                                    powerups[p][i].push(this.encode(pi[x]))
                                }
                                this.powerups.push(powerups[p][i].join(" "))
                                break;
                            case 'antigravity':
                                powerups[p][i].push('A')
                                for(var x in pi){
                                    powerups[p][i].push(this.encode(pi[x]))
                                }
                                this.powerups.push(powerups[p][i].join(" "))
                                break;
                            case 'boosters':
                                powerups[p][i].push('B')
                                for(var x in pi){
                                    powerups[p][i].push(this.encode(pi[x]))
                                }
                                this.powerups.push(powerups[p][i].join(" "))
                                break;
                            case 'teleporters':
                                powerups[p][i].push('W')
                                for(var x in pi){
                                    powerups[p][i].push(this.encode(pi[x]))
                                }
                                this.powerups.push(powerups[p][i].join(" "))
                                break;
                        }
                    }
                }
            }
        }
        get export(){
            this.encodePhysics()
            this.encodeScenery()
            this.encodePowerups()
            return this.black.join(",") + "#" + this.grey.join(",") + "#" + this.powerups.join(",")
        }
    },
}
