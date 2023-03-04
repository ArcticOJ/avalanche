import type {WorkerEvent} from 'lib/types/common';

import {Compiler} from 'lib/clang/compiler.mjs';

const CDN_URL = '/static/clang';

function dispatch(event: string, data?: any) {
  postMessage({
    event,
    data
  });
}

const compiler = new Compiler({
  cdnUrl: `${CDN_URL}/`,
  showTiming: false,
  onDispatch: dispatch
});

addEventListener('message', async (e: MessageEvent<WorkerEvent>) => {
  if (e.data.type === 'init' && !compiler.isReady && !compiler.isInitializing)
    await compiler.init();
  else if (e.data.type === 'abort') {
    compiler.disposeRunner();
  } else if (e.data.type === 'compile' && compiler.isReady)
    await compiler.compileLinkRun(e.data.data.input, e.data.data.content, ...e.data.data.args).catch(e => console.error(e));
});
