var i = i || function(t, e) {
    var i = {}
      , s = i.lib = {}
      , n = function() {}
      , r = s.Base = {
        extend: function(t) {
            n.prototype = this;
            var e = new n;
            return t && e.mixIn(t),
            e.hasOwnProperty("init") || (e.init = function() {
                e.$super.init.apply(this, arguments)
            }
            ),
            e.init.prototype = e,
            e.$super = this,
            e
        },
        create: function() {
            var t = this.extend();
            return t.init.apply(t, arguments),
            t
        },
        init: function() {},
        mixIn: function(t) {
            for (var e in t)
                t.hasOwnProperty(e) && (this[e] = t[e]);
            t.hasOwnProperty("toString") && (this.toString = t.toString)
        },
        clone: function() {
            return this.init.prototype.extend(this)
        }
    }
      , o = s.WordArray = r.extend({
        init: function(t, i) {
            t = this.words = t || [],
            this.sigBytes = i != e ? i : 4 * t.length
        },
        toString: function(t) {
            return (t || h).stringify(this)
        },
        concat: function(t) {
            var e = this.words
              , i = t.words
              , s = this.sigBytes;
            if (t = t.sigBytes,
            this.clamp(),
            s % 4)
                for (var n = 0; t > n; n++)
                    e[s + n >>> 2] |= (i[n >>> 2] >>> 24 - 8 * (n % 4) & 255) << 24 - 8 * ((s + n) % 4);
            else if (65535 < i.length)
                for (n = 0; t > n; n += 4)
                    e[s + n >>> 2] = i[n >>> 2];
            else
                e.push.apply(e, i);
            return this.sigBytes += t,
            this
        },
        clamp: function() {
            var e = this.words
              , i = this.sigBytes;
            e[i >>> 2] &= 4294967295 << 32 - 8 * (i % 4),
            e.length = t.ceil(i / 4)
        },
        clone: function() {
            var t = r.clone.call(this);
            return t.words = this.words.slice(0),
            t
        },
        random: function(e) {
            for (var i = [], s = 0; e > s; s += 4)
                i.push(4294967296 * t.random() | 0);
            return new o.init(i,e)
        }
    })
      , a = i.enc = {}
      , h = a.Hex = {
        stringify: function(t) {
            var e = t.words;
            t = t.sigBytes;
            for (var i = [], s = 0; t > s; s++) {
                var n = e[s >>> 2] >>> 24 - 8 * (s % 4) & 255;
                i.push((n >>> 4).toString(16)),
                i.push((15 & n).toString(16))
            }
            return i.join("")
        },
        parse: function(t) {
            for (var e = t.length, i = [], s = 0; e > s; s += 2)
                i[s >>> 3] |= parseInt(t.substr(s, 2), 16) << 24 - 4 * (s % 8);
            return new o.init(i,e / 2)
        }
    }
      , l = a.Latin1 = {
        stringify: function(t) {
            var e = t.words;
            t = t.sigBytes;
            for (var i = [], s = 0; t > s; s++)
                i.push(String.fromCharCode(e[s >>> 2] >>> 24 - 8 * (s % 4) & 255));
            return i.join("")
        },
        parse: function(t) {
            for (var e = t.length, i = [], s = 0; e > s; s++)
                i[s >>> 2] |= (255 & t.charCodeAt(s)) << 24 - 8 * (s % 4);
            return new o.init(i,e)
        }
    }
      , c = a.Utf8 = {
        stringify: function(t) {
            try {
                return decodeURIComponent(escape(l.stringify(t)))
            } catch (e) {
                throw Error("Malformed UTF-8 data")
            }
        },
        parse: function(t) {
            return l.parse(unescape(encodeURIComponent(t)))
        }
    }
      , u = s.BufferedBlockAlgorithm = r.extend({
        reset: function() {
            this._data = new o.init,
            this._nDataBytes = 0
        },
        _append: function(t) {
            "string" == typeof t && (t = c.parse(t)),
            this._data.concat(t),
            this._nDataBytes += t.sigBytes
        },
        _process: function(e) {
            var i = this._data
              , s = i.words
              , n = i.sigBytes
              , r = this.blockSize
              , a = n / (4 * r)
              , a = e ? t.ceil(a) : t.max((0 | a) - this._minBufferSize, 0);
            if (e = a * r,
            n = t.min(4 * e, n),
            e) {
                for (var h = 0; e > h; h += r)
                    this._doProcessBlock(s, h);
                h = s.splice(0, e),
                i.sigBytes -= n
            }
            return new o.init(h,n)
        },
        clone: function() {
            var t = r.clone.call(this);
            return t._data = this._data.clone(),
            t
        },
        _minBufferSize: 0
    });
    s.Hasher = u.extend({
        cfg: r.extend(),
        init: function(t) {
            this.cfg = this.cfg.extend(t),
            this.reset()
        },
        reset: function() {
            u.reset.call(this),
            this._doReset()
        },
        update: function(t) {
            return this._append(t),
            this._process(),
            this
        },
        finalize: function(t) {
            return t && this._append(t),
            this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(t) {
            return function(e, i) {
                return new t.init(i).finalize(e)
            }
        },
        _createHmacHelper: function(t) {
            return function(e, i) {
                return new p.HMAC.init(t,i).finalize(e)
            }
        }
    });
    var p = i.algo = {};
    return i
}(Math);
!function(t) {
    for (var e = i, s = e.lib, n = s.WordArray, r = s.Hasher, s = e.algo, o = [], a = [], h = function(t) {
        return 4294967296 * (t - (0 | t)) | 0
    }, l = 2, c = 0; 64 > c; ) {
        var u;
        t: {
            u = l;
            for (var p = t.sqrt(u), d = 2; p >= d; d++)
                if (!(u % d)) {
                    u = !1;
                    break t
                }
            u = !0
        }
        u && (8 > c && (o[c] = h(t.pow(l, .5))),
        a[c] = h(t.pow(l, 1 / 3)),
        c++),
        l++
    }
    var f = []
      , s = s.SHA256 = r.extend({
        _doReset: function() {
            this._hash = new n.init(o.slice(0))
        },
        _doProcessBlock: function(t, e) {
            for (var i = this._hash.words, s = i[0], n = i[1], r = i[2], o = i[3], h = i[4], l = i[5], c = i[6], u = i[7], p = 0; 64 > p; p++) {
                if (16 > p)
                    f[p] = 0 | t[e + p];
                else {
                    var d = f[p - 15]
                      , v = f[p - 2];
                    f[p] = ((d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3) + f[p - 7] + ((v << 15 | v >>> 17) ^ (v << 13 | v >>> 19) ^ v >>> 10) + f[p - 16]
                }
                d = u + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & l ^ ~h & c) + a[p] + f[p],
                v = ((s << 30 | s >>> 2) ^ (s << 19 | s >>> 13) ^ (s << 10 | s >>> 22)) + (s & n ^ s & r ^ n & r),
                u = c,
                c = l,
                l = h,
                h = o + d | 0,
                o = r,
                r = n,
                n = s,
                s = d + v | 0
            }
            i[0] = i[0] + s | 0,
            i[1] = i[1] + n | 0,
            i[2] = i[2] + r | 0,
            i[3] = i[3] + o | 0,
            i[4] = i[4] + h | 0,
            i[5] = i[5] + l | 0,
            i[6] = i[6] + c | 0,
            i[7] = i[7] + u | 0
        },
        _doFinalize: function() {
            var e = this._data
              , i = e.words
              , s = 8 * this._nDataBytes
              , n = 8 * e.sigBytes;
            return i[n >>> 5] |= 128 << 24 - n % 32,
            i[(n + 64 >>> 9 << 4) + 14] = t.floor(s / 4294967296),
            i[(n + 64 >>> 9 << 4) + 15] = s,
            e.sigBytes = 4 * i.length,
            this._process(),
            this._hash
        },
        clone: function() {
            var t = r.clone.call(this);
            return t._hash = this._hash.clone(),
            t
        }
    });
    e.SHA256 = r._createHelper(s),
    e.HmacSHA256 = r._createHmacHelper(s)
}(Math);

export default i;