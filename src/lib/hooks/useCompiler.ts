import {useCallback, useRef, useState} from 'react';
import {WorkerMessage} from 'lib/types/common';
import {useBoolean} from '@chakra-ui/react';

interface CompilerParameters {
  content(): string;

  stdin(): string;

  stdout(s: string): void;
}

interface CompilerHandler {
  running: boolean;
  enabled: boolean;
  ready: boolean;

  compile(std: string): void;

  enable(): void;

  abort(): void;
}

export default function useCompiler({stdin, stdout, content}: CompilerParameters): CompilerHandler {
  // TODO: Fix C++ 17, bits/stdc++.h, memory_resource.h not found
  const worker = useRef<Worker>(null);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [running, {on, off}] = useBoolean();
  const onMessage = useCallback((e: MessageEvent<WorkerMessage>) => {
    switch (e.data.event) {
    case 'ready':
      setReady(true);
      break;
    case 'output':
      stdout(e.data.data);
      break;
    case 'compileStart':
      on();
      break;
    case 'compileEnd':
      off();
      break;
    }
  }, []);

  const startWorker = useCallback(() => {
    setEnabled(true);
    if (worker.current) {
      worker.current.terminate();
      worker.current = null;
    }
    worker.current = new Worker(new URL('lib/workers/compiler.ts', import.meta.url), {
      name: 'compiler',
      type: 'module'
    });
    worker.current.addEventListener('message', onMessage);
    worker.current.postMessage({
      type: 'init'
    });
    return () => {
      setEnabled(false);
      setReady(false);
      worker.current.removeEventListener('message', onMessage);
      worker.current.terminate();
    };
  }, []);
  return {
    running,
    ready,
    enabled,
    enable: startWorker,
    abort() {
      if (ready && running)
        worker.current.postMessage({
          type: 'abort'
        });
    },
    compile(std) {
      if (ready)
        worker.current.postMessage({
          type: 'compile',
          data: {
            args: [`-std=${std}`],
            input: stdin(),
            content: content()
          }
        });
    }
  };
}
