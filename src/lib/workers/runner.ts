import {App} from 'lib/clang/app.mjs';
import {MemFS} from 'lib/clang/mem.mjs';

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

function dispatch(event: string, data?: any) {
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
    dispatch
  });
  memfs.setStdinStr(e.data.stdin);
  if (!e.data.buf || e.data.buf.length == 0)
    return;
  const mod = await WebAssembly.compile(e.data.buf);
  const app = new App(mod, memfs, 'main.wasm');
  await app.run();
  dispatch('done', Date.now());
});
