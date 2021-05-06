import https from 'https';
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
    if (b != void 0) {
        req.write(url ? b : `${b}&ajax=!0&t_1=ref&t_2=desk`);
    }
    req.end();
}
export default {
    getHome(callback = () => {}) {
        request('GET', '', (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            callback(d);
        });
    },
    getPlayerLB(page, callback = () => {}) {
        request('GET', `/leaderboards/player/lifetime/${page}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            if (!d.player) return callback(`Page "${page}" does not exist`);
            callback(d);
        });
    },
    getAuthorLB(page, callback = () => {}) {
        request('GET', `/leaderboards/author/lifetime/${page}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            if (!d.author) return callback(`Page "${page}" does not exist`);
            callback(d);
        });
    },
    getCategory(category, callback = () => {}) {
        request('GET', `/${category}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            if (!d.tracks) return callback(`No category by the name of "${d.user.u_name}"`);
            callback(d);
        });
    },
    getUser(u, callback = () => {}) {
        request('GET', `/u/${u}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            if (!d.user) return callback(`No user by the name of "${u}"`);
            callback(d);
        });
    },
    getTrack(t, callback = () => {}) {
        request('GET', `/t/${t}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            if (!d.track) return callback(`No track by the id "${t}"`);
            callback(d);
        });
    },
    getRandom(callback = () => {}) {
        request('GET', `/random/track?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            callback(d);
        });
    },
    getRace(t, u, callback = () => {}) {
        request('GET', `/t/${t}/r/${u}?ajax=!0`, void 0, (err, d) => {
            d = JSON.parse(d);
            if (err) return callback(err);
            if (!d) return callback(`Invalid inputs`);
            callback(d);
        });
    },
    getFeaturedGhosts(callback = () => {}) {
        request('GET', `/Calculamatrise/Official_Featured_Ghosts/master/ghosts.json`, void 0, (err, d) => {
            if (err) return callback(err);
            callback(JSON.parse(d));
        }, 'raw.githubusercontent.com');
    },
    User: class {
        constructor() {
            this.token = null;
            this.activity_time_ago = null;
        }
        login(token) {
            this.token = token;
        }
        logout() {
            this.token = null;
            this.user = null;
        }
        defaultLogin(u, p) {
            request('POST', `auth/standard_login`, `login=${u}&password=${p}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                d = JSON.parse(d);
                this.user = d.user;
                callback(d);
            });
        }
        verifyLogin(callback = () => {}) {
            if (!this.token) return console.error('You are not logged in');
            request('GET', `/?ajax=!0&app_signed_request=${this.token}`, void 0, (err, d) => {
                if (err) return callback(err);
                d = JSON.parse(d);
                this.user = d.user;
                callback(d);
            });
        }
        getUser(u, callback = () => {}) {
            request('GET', `/u/${u}?ajax=!0`, void 0, (err, d) => {
                d = JSON.parse(d);
                if (err) return callback(err);
                if (!d.user) return callback(`No user by the name of "${u}"`);
                callback(d);
            });
        }
        getMyUser(callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            this.verifyLogin(d => {
                if (!d) return callback("Error");
                this.getUser(this.user.d_name, d => {
                    this.user = d.user;
                    callback(d);
                });
            });
        }
        getTrack(t, callback = () => {}) {
            request('GET', `/t/${t}?ajax=!0`, void 0, (err, d) => {
                d = JSON.parse(d);
                if (err) return callback(err);
                if (!d.track) return callback(`No track by the id "${t}"`);
                callback(d);
            });
        }
        getNotifications(callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('GET', `/notifications?ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`, void 0, (err, d) => {
                if (err) return callback(err);
                callback(JSON.parse(d));
            });
        }
        getComment(t, c, callback = () => {}) {
            if (!t || !c) return callback('False arguments');
            this.getTrack(t, d => {
                for(var i in d.track_comments) {
                    if (d.track_comments[i].comment.id == c) {
                        callback(d.track_comments[i])
                    }
                }
            });
        }
        datapoll(callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('POST', '/datapoll/poll_request', `notifications=true&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeName(n, callback = () => {}) {
            if (!n) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/account/edit_profile', `name=u_name&value=${encodeURIComponent(n.replace(/[^A-Z0-9]/ig, ""))}&app_signed_request=${this.token}`, (err, d) => {
                d = JSON.parse(d);
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeDesc(d, callback = () => {}) {
            if (!d) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/account/edit_profile', `name=about&value=${encodeURIComponent(d).replace('%20', '+')}&app_signed_request=${this.token}`, (err, x) => {
                x = JSON.parse(x);
                if (err) return callback(err);
                this.user = x.user;
                callback(x);
            });
        }
        changePassword(o, n, callback = () => {}) {
            if (!n || !o) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/account/change_password', `old_password=${encodeURIComponent(o).replace('%20', '+')}&new_password=${encodeURIComponent(n).replace('%20', '+')}&app_signed_request=${this.token}`, (err, d) => {
                d = JSON.parse(d);
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeForumsPassword(p, callback = () => {}) {
            if (!p) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/account/update_forum_account', `password=${encodeURIComponent(p).replace('%20', '+')}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        buyHead(callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('POST', '/store/buy', (err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        equipHead(h, callback = () => {}) {
            if (!h) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/store/equip', `item_id=${h}`,(err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        addFriend(f, callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('POST', '/friends/send_friend_request', `u_name=${f}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        removeFriend(i, callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('POST', '/friends/remove_friend', `u_id=${i}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        acceptFriend(i, callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('POST', '/friends/respond_to_friend_request', `u_id=${i}&action=accept&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        challenge(u, m, t, callback = () => {}) {
            if (!u || !m || !t) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/challenge/send', `users%5B%5D=${u.join("&users%5B%5D=")}&msg=${m}&track_slug=${t}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                callback(d);
            });
        }
        comment(t, m, callback = () => {}) {
            if (!t || !m) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/track_comments/post', `t_id=${t}&msg=${encodeURIComponent(m).replace('%20', '+')}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                callback(d);
            });
        }
        vote(t, v, callback = () => {}) {
            if (!t || !v) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/track_api/vote', `t_id=${tId}&vote=${vote}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                callback(d);
            });
        }
        subscribe(i, callback = () => {}) {
            if (!i) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/track_api/subscribe', `sub_uid=${i}&subscribe=1&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        hideTrack(t, callback = () => {}) {
            if (!t) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/moderator/hide_track/' + t, `ajax=!0&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        removeRace(t, callback = () => {}) {
            if (!t) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/moderator/remove_race', `t_id=${t}&u_id=${this.user.u_id}&ajax=!0&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        toggleOA(u, callback = () => {}) {
            if (!u) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/moderator/toggle_official_author/' + u, `ajax=!0&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        addDailyTrack(track, lives, refill_cost, gems, callback = () => {}) {
            if (!track || !lives || !refill_cost || !gems) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/moderator/add_track_of_the_day', `t_id=${track}&lives=${lives}&rfll_cst=${refill_cost}&gems=${gems}&ajax=!0&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        banUser(u, callback = () => {}) {
            if (!track || !lives || !refill_cost || !gems) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/moderator/ban_user', `u_id=${u}&ajax=!0&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        changeUsername(u, newu, callback = () => {}) {
            if (!track || !lives || !refill_cost || !gems) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/moderator/change_username', `u_id=${u}&username=${newu}&ajax=!0&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        changeEmail(u, e, callback = () => {}) {
            if (!track || !lives || !refill_cost || !gems) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/moderator/change_email', `u_id=${u}&email=${e}&ajax=!0&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                callback(x);
            });
        }
        redeemCoupon(c, callback = () => {}) {
            if (!c) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', '/store/redeemCouponCode', `coupon_code=${c}&app_signed_request=${this.token}`, (err, d) => {
                if (err) return callback(err);
                callback(d);
            });
        }
        signup(u, e, p, callback = () => {}) {
            if (!u || !e || !p) return callback('False arguments');
            request('POST', '/auth/standard_signup', `username=${encodeURIComponent(u)}&email=${encodeURIComponent(e).replace('%20', '+')}&password=${encodeURIComponent(p).replace('%20', '+')}&recaptcha=03AGdBq252AkaYfc0P6E9u_GQq4aruILoiMcMMMZgxXfGKa-Y2nASs5BEjB-df6V6fSyYuBG8xs4nlcwb5ASfsJL98W1Pq2HUXyR5QyFT-FgZ8ljubncpwK92q5XKnaXWthEfbA0EvH1qV2Rh4a6WQSpoo01kgteHf5C3dvK6c8rhM1nZThunHUNAgld1_AljlDS7cYXGsPSAdLXOFcMwz_TtcliBTei_f3TiQTasfNIFWfrgdWCyWSARj5LGbrciLS_-65cgoMbuh9rSLqOAduwn_RCcVoteCX6RlfVT3DPsVr1v7uJseYuTvgrVGpsrrrBx87O3pO_n0zGnRZpYU65qfx8Z7hjVvrohuvJgmDE7qtDsshmsmwo-OiJ0yc5WwRV2m63XrC9I-1JA8ZjAGg5xhPhh0NkCAQrMKSkUrkdgPg2VpEc9ZJZalUOdex8GpzDQ23gwqmh_gknLC2dhr8C5QpFCLfIl8eA&app_signed_request=${this.token}`, (err, d) => {
                d = JSON.parse(d);
                if (err) return callback(err);
                this.user = d.user;
                this.token = d.app_signed_request;
                callback(d)
            });
        }
        publish(n, d, v, m, b, c, callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('POST', '/create/submit', `name=${encodeURIComponent(n).replace('%20', '+')}&desc=${encodeURIComponent(d).replace('%20', '+')}&default_vehicle=${v}&allowed_vehicles%5BMTB%5D=${m}&allowed_vehicles%5BBMX%5D=${b}&code=${encodeURIComponent(c).replace('%20', '+')}&app_signed_request=${this.token}`, (err, x) => {
                if (err) return callback(err);
                this.user = x.user;
                callback(x);
            });
        }
    },
    Track: class {
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
}
