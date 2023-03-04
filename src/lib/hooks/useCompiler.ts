import {useCallback, useEffect, useRef, useState} from 'react';
import {WorkerMessage} from 'lib/types/common';
import {useIsomorphicLayoutEffect} from 'framer-motion';
import {notify} from 'lib/notifications';
import {Button, ButtonGroup, Text, useBoolean, VStack} from '@chakra-ui/react';
import {Check, HelpCircle} from 'react-feather';
import throttle from 'lodash.throttle';

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
}

export default function useCompiler({stdin, stdout, content}: CompilerParameters): CompilerHandler {
  // TODO: Fix C++ 17, bits/stdc++.h, memory_resource.h not found
  const worker = useRef<Worker>();
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [running, {on, off}] = useBoolean();
  const enable = useCallback(throttle(() => {
    setEnabled(true);
    worker.current.postMessage({
      type: 'init'
    });
  }, 2000), []);
  const onMessage = (e: MessageEvent<WorkerMessage>) => {
    switch (e.data.event) {
    case 'ready':
      setReady(true);
      break;
    case 'output':
      stdout(e.data.data);
      break;
    case 'compileStart':
    case 'compileEnd':
      if (e.data.event === 'compileStart')
        on();
      else
        off();
      break;
    }
  };
  useIsomorphicLayoutEffect(() => {
    worker.current = new Worker(new URL('lib/workers/compiler.ts', import.meta.url), {
      name: 'compiler'
    });
    worker.current.addEventListener('message', onMessage);
    return () => {
      worker.current.removeEventListener('message', onMessage);
      worker.current.terminate();
    };
  }, []);
  return {
    running,
    ready,
    enabled,
    enable,
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
