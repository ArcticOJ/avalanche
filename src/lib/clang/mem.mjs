import {assert, getImportObject, getInstance, readStr} from 'lib/clang/utils.js';
import {AbortError} from 'lib/clang/errors.mjs';
import {ESUCCESS} from 'lib/clang/constants.mjs';

export class Memory {
    constructor(memory) {
        this.memory = memory;
        this.buffer = this.memory.buffer;
        this.u8 = new Uint8Array(this.buffer);
        this.u32 = new Uint32Array(this.buffer);
    }

    check() {
        if (this.buffer.byteLength === 0) {
            this.buffer = this.memory.buffer;
            this.u8 = new Uint8Array(this.buffer);
            this.u32 = new Uint32Array(this.buffer);
        }
    }

    read8(o) {
        return this.u8[o];
    }

    read32(o) {
        return this.u32[o >> 2];
    }

    write8(o, v) {
        this.u8[o] = v;
    }

    write32(o, v) {
        this.u32[o >> 2] = v;
    }

    write64(o, vlo, vhi = 0) {
        this.write32(o, vlo);
        this.write32(o + 4, vhi);
    }

    readStr(o, len) {
        return readStr(this.u8, o, len);
    }

    // Null-terminated string.
    writeStr(o, str) {
        o += this.write(o, str);
        this.write8(o, 0);
        return str.length + 1;
    }

    write(o, buf) {
        if (buf instanceof ArrayBuffer) {
            return this.write(o, new Uint8Array(buf));
        } else if (typeof buf === 'string') {
            return this.write(o, buf.split('').map(x => x.charCodeAt(0)));
        } else {
            const dst = new Uint8Array(this.buffer, o, buf.length);
            dst.set(buf);
            return buf.length;
        }
    }
}

export class MemFS {
    constructor(options) {
        this.stdinStr = options.stdinStr || '';
        this.stdinStrPos = 0;
        this.dispatch = options.dispatch;
        this.hostMem_ = options.wmem;
        const env = getImportObject(this, ['abort', 'host_write', 'host_read', 'memfs_log', 'copy_in', 'copy_out']);
        this.ready = getInstance(options.compiledModule, {
            env,
            js: {
                mem: this.hostMem
            }
        })
            .then(instance => {
                this.instance = instance;
                this.exports = instance.exports;
                this.mem = new Memory(this.exports.memory);
                this.exports.init();
            });
    }

    get hostMem() {
        return this.hostMem_;
    }

    setStdinStr(str) {
        this.stdinStr = str;
        this.stdinStrPos = 0;
    }

    addDirectory(path) {
        this.mem.check();
        this.mem.write(this.exports.GetPathBuf(), path);
        this.exports.AddDirectoryNode(path.length);
    }

    addFile(path, contents) {
        const length = contents instanceof ArrayBuffer ? contents.byteLength : contents.length;
        this.mem.check();
        this.mem.write(this.exports.GetPathBuf(), path);
        const inode = this.exports.AddFileNode(path.length, length);
        const addr = this.exports.GetFileNodeAddress(inode);
        this.mem.check();
        this.mem.write(addr, contents);
    }

    getFileContents(path) {
        this.mem.check();
        this.mem.write(this.exports.GetPathBuf(), path);
        const inode = this.exports.FindNode(path.length);
        const addr = this.exports.GetFileNodeAddress(inode);
        const size = this.exports.GetFileNodeSize(inode);
        return new Uint8Array(this.mem.buffer, addr, size);
    }

    abort() {
        throw new AbortError();
    }

    host_write(fd, iovs, iovs_len, nwritten_out) {
        this.hostMem_.check();
        assert(fd <= 2);
        let size = 0;
        let str = '';
        for (let i = 0; i < iovs_len; ++i) {
            const buf = this.hostMem_.read32(iovs);
            iovs += 4;
            const len = this.hostMem_.read32(iovs);
            iovs += 4;
            str += this.hostMem_.readStr(buf, len);
            size += len;
        }
        this.hostMem_.write32(nwritten_out, size);
        this.dispatch('output', str);
        return ESUCCESS;
    }

    host_read(fd, iovs, iovs_len, nread) {
        this.hostMem_.check();
        assert(fd === 0);
        let size = 0;
        for (let i = 0; i < iovs_len; ++i) {
            const buf = this.hostMem_.read32(iovs);
            iovs += 4;
            const len = this.hostMem_.read32(iovs);
            iovs += 4;
            const lenToWrite = Math.min(len, (this.stdinStr.length - this.stdinStrPos));
            if (lenToWrite === 0) break;
            this.hostMem_.write(buf, this.stdinStr.substring(this.stdinStrPos, lenToWrite));
            size += lenToWrite;
            this.stdinStrPos += lenToWrite;
            if (lenToWrite !== len) break;
        }
        // For logging
        // this.hostWrite("Read "+ size + "bytes, pos: "+ this.stdinStrPos + "\n");
        this.hostMem_.write32(nread, size);
        return ESUCCESS;
    }

    memfs_log(buf, len) {
        this.mem.check();
        console.log(this.mem.readStr(buf, len));
    }

    copy_out(clang_dst, memfs_src, size) {
        this.hostMem_.check();
        const dst = new Uint8Array(this.hostMem_.buffer, clang_dst, size);
        this.mem.check();
        const src = new Uint8Array(this.mem.buffer, memfs_src, size);
        // console.log(`copy_out(${clang_dst.toString(16)}, ${memfs_src.toString(16)}, ${size})`);
        dst.set(src);
    }

    copy_in(memfs_dst, clang_src, size) {
        this.mem.check();
        const dst = new Uint8Array(this.mem.buffer, memfs_dst, size);
        this.hostMem_.check();
        const src = new Uint8Array(this.hostMem_.buffer, clang_src, size);
        // console.log(`copy_in(${memfs_dst.toString(16)}, ${clang_src.toString(16)}, ${size})`);
        dst.set(src);
    }
}
