import zlib from "zlib";
import util from "util";

import buffer from "buffer";
let kMaxLength = buffer.kMaxLength;

function _close(engine, callback) {
    if (callback) {
        process.nextTick(callback);
    }

    // Caller may invoke .close after a zlib error (which will null _handle).
    if (!engine._handle) {
        return;
    }

    engine._handle.close();
    engine._handle = null;
}

class Inflate {
    constructor(opts) {
        if (!(this instanceof Inflate)) {
            return new Inflate(opts);
        }

        if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
            opts.chunkSize = zlib.Z_MIN_CHUNK;
        }

        zlib.Inflate.call(this, opts);

        // Node 8 --> 9 compatibility check
        this._offset = this._offset === undefined ? this._outOffset : this._offset;
        this._buffer = this._buffer || this._outBuffer;

        if (opts && opts.maxLength != null) {
            this._maxLength = opts.maxLength;
        }
    }

    _processChunk(chunk, flushFlag, asyncCb) {
        if (typeof asyncCb === "function") {
            return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
        }
    
        let self = this;
    
        let availInBefore = chunk && chunk.length;
        let availOutBefore = this._chunkSize - this._offset;
        let leftToInflate = this._maxLength;
        let inOff = 0;
    
        let buffers = [];
        let nread = 0;
    
        let error;
        this.on("error", function (err) {
            error = err;
        });
    
        function handleChunk(availInAfter, availOutAfter) {
            if (self._hadError) {
                return;
            }
    
            let have = availOutBefore - availOutAfter;
            if (have > 0) {
                let out = self._buffer.slice(self._offset, self._offset + have);
                self._offset += have;
    
                if (out.length > leftToInflate) {
                    out = out.slice(0, leftToInflate);
                }
    
                buffers.push(out);
                nread += out.length;
                leftToInflate -= out.length;
    
                if (leftToInflate === 0) {
                    return false;
                }
            } else if (have < 0) {
                throw new Error("have should not go down");
            }
    
            if (availOutAfter === 0 || self._offset >= self._chunkSize) {
                availOutBefore = self._chunkSize;
                self._offset = 0;
                self._buffer = Buffer.allocUnsafe(self._chunkSize);
            }
    
            if (availOutAfter === 0) {
                inOff += availInBefore - availInAfter;
                availInBefore = availInAfter;
    
                return true;
            }
    
            return false;
        }
    
        if (!this._handle) {
            throw new Error("zlib binding closed");
        }
        
        let res;
        do {
            res = this._handle.writeSync(
                flushFlag,
                chunk, // in
                inOff, // in_off
                availInBefore, // in_len
                this._buffer, // out
                this._offset, //out_off
                availOutBefore
            ); // out_len
            // Node 8 --> 9 compatibility check
            res = res || this._writeState;
        } while (!this._hadError && handleChunk(res[0], res[1]));
    
        if (this._hadError) {
            throw error;
        }
    
        if (nread >= kMaxLength) {
            _close(this);
            throw new RangeError(
                "Cannot create final Buffer. It would be larger than 0x" +
                kMaxLength.toString(16) +
                " bytes"
            );
        }
    
        let buf = Buffer.concat(buffers, nread);
        _close(this);
    
        return buf;
    }
}

util.inherits(Inflate, zlib.Inflate);

export default function(buffer, opts) {
    if (typeof buffer === "string") {
        buffer = Buffer.from(buffer);
    }
    if (!(buffer instanceof Buffer)) {
        throw new TypeError("Not a string or buffer");
    }

    const engine = new Inflate(opts);

    let flushFlag = engine._finishFlushFlag;

    return engine._processChunk(buffer, flushFlag);
}