/*
 * Copyright 2020 WebAssembly Community Group participants
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {unzip} from 'unzipit';
import {MemFS} from 'lib/clang/mem.js';
import {Tar} from 'lib/clang/tar.js';
import {App} from 'lib/clang/app.js';

export class Compiler {
  runner = null;
  isReady = false;
  isInitializing = false;
  clangCommonArgs = ['-disable-free', '-isysroot', '/', '-internal-isystem', '/include/c++/v1', '-internal-isystem', '/include', '-ferror-limit', '19', '-fmessage-length', '80', '-fcolor-diagnostics'];

  constructor(options) {
    this.moduleCache = {};
    this.mem = new WebAssembly.Memory({
      initial: 2000, maximum: 2000, // ~ 131 MB
      shared: true
    });
    this.emit = options.onEmit;
    this.hostStatus = options.hostStatus;
    this.bundleFilename = options.bundle || 'bundle.zip';
    this.lldFilename = options.lld || 'lld';
    this.clangFilename = options.clang || 'clang';
    this.cdnUrl = options.cdnUrl || '/static';
    this.memfsFilename = options.memfs || 'memfs';
    this.onReady = options.onReady;
    Compiler.compileStreaming(this.cdnUrl + this.memfsFilename).then(mod => {
      this.moduleCache[this.memfsFilename] = mod;
      this.memfs = new MemFS({
        wmem: this.mem,
        compiledModule: mod,
        emit: options.onEmit,
        memfsFilename: this.cdnUrl + (options.memfs || 'memfs')
      });
    });
  }

  static async compileStreaming(filename) {
    const response = await fetch(filename);
    return WebAssembly.compile(await response.arrayBuffer());
  }

  async init() {
    if (this.isReady) return;
    this.isInitializing = true;
    await this.memfs.ready;
    await this.preloadBundle();
    this.isInitializing = false;
    this.isReady = true;
    this.emit('ready');
  }

  hostWrite(data) {
    console.log(data);
    this.emit('output', data);
  }

  async preloadBundle() {
    const bundle = await fetch(this.cdnUrl + this.bundleFilename);
    const {entries} = await unzip(await bundle.arrayBuffer());
    for (const [name, entry] of Object.entries(entries)) {
      const buf = await entry.arrayBuffer();
      if (name === 'sysroot.tar') {
        await this.hostLogAsync('Decompressing sysroot.', (async () => {
          const tar = new Tar(buf);
          tar.decompress(this.memfs);
        })());
      } else this.moduleCache[name] = await this.hostLogAsync(`Preloading ${name}`, WebAssembly.compile(buf));
    }
  }

  async hostLogAsync(message, promise) {
    console.log(message);
    const result = await promise;
    console.info('Done.');
    return result;
  }

  async getModule(name) {
    if (this.moduleCache[name]) return this.moduleCache[name];
    throw new Error(`Module ${name} is not loaded.`);
  }

  async compile(options) {
    const input = options.input;
    const contents = options.contents;
    const obj = options.obj;
    const opt = options.opt || '2';
    const clangFlags = options.clangFlags || [];

    this.memfs.addFile(input, contents);
    const clang = await this.getModule(this.clangFilename);
    return await this.run(clang, 'clang', '-cc1', '-emit-obj', ...this.clangCommonArgs, ...clangFlags, '-O' + opt, '-o', obj, '-x', 'c++', input);
  }

  async link(obj, wasm) {
    const stackSize = 1024 * 1024;

    const libDir = '/lib/wasm32-wasi';
    const clangLibDir = '/lib/clang/8.0.1/lib/wasi';
    const builtins = `${clangLibDir}/libclang_rt.builtins-wasm32.a`;
    const crt1 = `${libDir}/crt1.o`;
    const lld = await this.getModule(this.lldFilename);
    return await this.run(lld, 'wasm-ld', '--no-threads', '--export-dynamic', `--max-memory=${(1 << 20) * 100}`, '-z', `stack-size=${stackSize}`, `-L${libDir}`, crt1, `-L${clangLibDir}`, builtins, obj, '-lc', '-lc++', '-lc++abi', '-o', wasm);
  }

  async run(module, name, ...args) {
    const app = new App(module, this.memfs, name, ...args);
    const stillRunning = await app.run();
    return stillRunning ? app : null;
  }

  disposeRunner() {
    if (this.runner) {
      this.runner.terminate();
      this.runner = null;
    }
    this.emit('compileEnd', Date.now());
  }

  async compileLinkRun(stdin, contents, ...flags) {
    if (this.runner) this.disposeRunner();
    try {
      this.emit('compileStart', Date.now());
      const input = 'main.cc';
      const obj = 'main.o';
      const wasm = 'main.wasm';
      await this.compile({input, contents, obj, clangFlags: flags || []});
      await this.link(obj, wasm);

      const buffer = this.memfs.getFileContents(wasm);
      this.runner = new Worker(new URL('lib/workers/runner.ts', import.meta.url), {
        name: 'runner',
        type: 'module'
      });
      this.runner.onmessage = e => {
        console.log(e);
        switch (e.data.event) {
        case 'output':
          this.hostWrite(e.data.data);
          break;
        case 'done':
          this.disposeRunner();
          break;
        }
      };
      this.runner.postMessage({
        fileName: wasm, mem: {
          fs: await this.getModule(this.memfsFilename), wmem: this.mem
        }, stdin, buf: buffer
      });
      //setTimeout(() => this.disposeRunner, 5e3);
    } catch (e) {
      this.disposeRunner();
    }
  }
}
