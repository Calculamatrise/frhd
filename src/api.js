const https = require('https');
function request(method, path, callback = () => {}, url) {
    let options = {
        hostname: url ? url : 'www.freeriderhd.com',
        port: 443,
        path: path,
        method: method,
        headers: method == 'POST' ? {
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
        request('GET', `/leaderboards/player/lifetime/${page}?ajax=!0`, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.player) return callback(`Page "${page}" does not exist`);
            callback(d);
        });
    },
    getAuthorLB: function(page, callback = () => {}){
        request('GET', `/leaderboards/author/lifetime/${page}?ajax=!0`, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.author) return callback(`Page "${page}" does not exist`);
            callback(d);
        });
    },
    getCategory: function(category, callback = () => {}){
        request('GET', `/${category}?ajax=!0`, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.tracks) return callback(`No category by the name of "${d.user.u_name}"`);
            callback(d);
        });
    },
    getUser: function(u, callback = () => {}){
        request('GET', `/u/${u}?ajax=!0`, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.user) return callback(`No user by the name of "${u}"`);
            callback(d);
        });
    },
    getTrack: function(t, callback = () => {}){
        request('GET', `/t/${t}?ajax=!0`, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            if(!d.track) return callback(`No track by the id "${t}"`);
            callback(d);
        });
    },
    getRandom: function(callback = () => {}){
        request('GET', `/random/track?ajax=!0`, (err, d) => {
            d = JSON.parse(d);
            if(err) return callback(err);
            callback(d);
        });
    },
    getFeaturedGhosts: function(callback = () => {}){
        request('GET', `/Calculus0972/Official_Featured_Ghosts/master/ghosts.json`, (err, d) => {
            if(err) return callback(err);
            callback(JSON.parse(d));
        }, 'raw.githubusercontent.com');
    },
    User: class {
        constructor(){
            this.token = null;
        }
        login(token){
            this.token = token;
        }
        logout(){
            this.token = null;
            this.user = null;
        }
        verifyLogin(callback = () => {}) {
            if(!this.token) return console.error('You are not logged in');
            request('GET', `/?ajax=!0&app_signed_request=${this.token}`, (err, d) => {
                if(err) return callback(err);
                d = JSON.parse(d);
                this.user = d.user;
                callback(d);
            });
        }
        getUser(u, callback = () => {}){
            request('GET', `/u/${u}?ajax=!0`, (err, d) => {
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
        getNotifications(callback = () => {}) {
            request('GET', `/notifications?ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`, (err, d) => {
                if(err) return callback(err);
                callback(JSON.parse(d));
            });
        }
        changeName(n, callback = () => {}) {
            if(!n) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', `/account/edit_profile?name=u_name&value=${encodeURIComponent(name.replace(/[^A-Z0-9]/ig, ""))}`, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeDesc(d, callback = () => {}) {
            if(!d) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', `/account/edit_profile?name=about&value=${encodeURIComponent(d).replace('%20', '+')}`, (err, x) => {
                x = JSON.parse(x);
                if (err) return callback(err);
                this.user = x.user;
                callback(x);
            });
        }
        changePassword(o, n, callback = () => {}) {
            if(!n || !o) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', `/account/change_password?old_password=${encodeURIComponent(o).replace('%20', '+')}&new_password=${encodeURIComponent(n).replace('%20', '+')}`, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        changeForumsPassword(p, callback = () => {}) {
            if(!p) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', `/account/update_forum_account?password=${encodeURIComponent(p).replace('%20', '+')}`, (err, d) => {
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
        addFriend(n, callback = () => {}) {
            if(!this.token) return callback('You are not logged in');
            request('POST', `/friends/send_friend_request?app_signed_request=${this.token}&u_name=${n}`, (err, d) => {
                if(err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        acceptFriend(i, callback = () => {}) {
            if(!this.token) return callback('You are not logged in');
            request('POST', `/friends/respond_to_friend_request?u_id=${i}&action=accept`, (err, d) => {
                if (err) return callback(err);
                this.user = d.user;
                callback(d);
            });
        }
        comment(t, m, callback = () => {}) {
            if(!t || !m) return callback('False arguments');
            if(!this.token) return callback('You are not logged in');
            request('POST', `/track_comments/post?t_id=${t}&msg=${encodeURIComponent(m).replace('%20', '+')}`, (err, d) => {
                if(err) return callback(err);
                callback(d);
            });
        }
        vote(t, v, callback = () => { }) {
            if (!t || !v) return callback('False arguments');
            if (!this.token) return callback('You are not logged in');
            request('POST', `/track_api/vote?t_id=${tId}&vote=${vote}`, (err, d) => {
                if(err) return callback(err);
                callback(d);
            });
        }
        signup(u, e, p, callback = () => {}) {
            if (!u || !e || !p) return callback('False arguments');
            request('POST', `/auth/standard_signup?username=${encodeURIComponent(u)}&email=${encodeURIComponent(e).replace('%20', '+')}&password=${encodeURIComponent(p).replace('%20', '+')}`, (err, d) => {
                d = JSON.parse(d);
                if(err) return callback(err);
                this.user = d.user;
                this.token = d.app_signed_request;
                callback(d)
            });
        }
        publish(n, d, d_v, mtb, bmx, c, callback = () => {}) {
            if (!this.token) return callback('You are not logged in');
            request('POST', `/create/submit?name=${encodeURIComponent(n).replace('%20', '+')}&desc=${encodeURIComponent(d).replace('%20', '+')}&default_vehicle=${d_v}&allowed_vehicles%5BMTB%5D=${mtb}&allowed_vehicles%5BBMX%5D=${bmx}&code=${encodeURIComponent(c).replace('%20', '+')}`, (err, x) => {
                if (err) return err(err);
                this.user = x.user;
                callback(x);
            });
        }
    },
    Track: class {
        constructor(){
            this.black = [],
            this.grey = [],
            this.powerup = [],
            this.powerups = {
                targets: [],
                slowmos: [],
                bombs: [],
                checkpoints: [],
                antigravities: [],
                boosts: [],
                teleporters: [],
                vehicles: {
                    heli: [],
                    truck: [],
                    balloon: [],
                    blob: []
                }
            }
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
                boosts: [],
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
        drawPhysicsLine(x, y, ex, ey){
            this.black.push([this.encode(x), this.encode(y), this.encode(ex), this.encode(ey)].join(" "))
        }
        drawSceneryLine(x, y, ex, ey){
            this.grey.push([this.encode(x), this.encode(y), this.encode(ex), this.encode(ey)].join(" "))
        }
        drawStart(){
            this.drawPhysicsLine(-40, 50, 40, 50)
        }
        drawTarget(x, y){
            this.powerups.targets.push("T " + [this.encode(x), this.encode(y)].join(" "));
        }
        drawSlowmo(x, y){
            this.powerups.slowmos.push("S " + [this.encode(x), this.encode(y)].join(" "))
        }
        drawBomb(x, y){
            this.powerups.bombs.push("O " + [this.encode(x), this.encode(y)].join(" "));
        }
        drawCheckpoint(x, y){
            this.powerups.checkpoints.push("C " + [this.encode(x), this.encode(y)].join(" "))
        }
        drawAntigravity(x, y){
            this.powerups.antigravity.push("A " + [this.encode(x), this.encode(y)].join(" "));
        }
        drawBoost(x, y){
            this.powerups.boosts.push("B " + [this.encode(x), this.encode(y)].join(" "))
        }
        drawGravity(x, y){
            this.powerups.gravity.push("G " + [this.encode(x), this.encode(y)].join(" "));
        }
        drawTeleport(x, y){
            this.powerups.teleporters.push("W " + [this.encode(x), this.encode(y)].join(" "))
        }
        drawHeli(x, y, t){
            this.powerups.vehicles.heli.push("V " + [this.encode(x), this.encode(y), "1",this.encode(t)].join(" "))
        }
        drawTruck(x, y, t){
            this.powerups.vehicles.truck.push("V " + [this.encode(x), this.encode(y), "2",this.encode(t)].join(" "))
        }
        drawBalloon(x, y, t){
            this.powerups.vehicles.balloon.push("V " + [this.encode(x), this.encode(y), "3",this.encode(t)].join(" "))
        }
        drawBlob(x, y, t){
            this.powerups.vehicles.blob.push("V " + [this.encode(x), this.encode(y), "4",this.encode(t)].join(" "))
        }
        drawVehicle(x, y, v, t){
            v = v.toLowerCase();
            if(!["heli", "truck", "balloon", "blob"].includes(v)) return console.error(v + " IS NOT A VEHICLE");
            this.powerups.vehicles[v].push("V " + [this.encode(x), this.encode(y), (v == "heli" ? "1" : v == "truck" ? "2" : v == "balloon" ? "3" : v == "blob" ? "4" : ""), this.encode(t)].join(" "))
        }
        drawPowerups(){
            for(var p in this.powerups){
                for(var i in this.powerups[p]){
                    if(Array.isArray(this.powerups[p][i])){
                        for(var v of this.powerups[p][i]){
                            this.powerup.push(v)
                        }
                    } else {
                        this.powerup.push(this.powerups[p][i])
                    }
                }
            }
        }
        get export(){
            this.drawPowerups()
            return this.black.join(",") + "#" + this.grey.join(",") + "#" + this.powerup.join(",")
        }
    },
}
