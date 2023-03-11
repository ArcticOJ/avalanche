import {App} from 'lib/clang/app.js';
import {MemFS} from 'lib/clang/mem.js';

interface CompiledBinary {
  fileName: string;
  buf: Uint8Array;
  mem: MemObj;
  stdin: string;
}

interface MemObj {
  fs: WebAssembly.Module;
  wmem: WebAssembly.Memory;
}

function emit(event: string, data?: any) {
  console.log(event, data);
  postMessage({
    event,
    data
  });
}

addEventListener('message', async (e: MessageEvent<CompiledBinary>) => {
  const memfs = new MemFS({
    wmem: e.data.mem.wmem,
    compiledModule: e.data.mem.fs,
    emit
  });
  memfs.setStdinStr(e.data.stdin);
  if (!e.data.buf || e.data.buf.length == 0)
    return;
  const mod = await WebAssembly.compile(e.data.buf);
  const app = new App(mod, memfs, 'main.wasm');
  await app.run().finally(() => emit('done', Date.now()));
});
