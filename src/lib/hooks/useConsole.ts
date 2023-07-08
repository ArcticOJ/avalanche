import {MutableRefObject, useEffect, useRef} from 'react';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import useThrottle from 'lib/hooks/useThrottle';
import {CanvasAddon} from 'xterm-addon-canvas';
import {inconsolata} from 'lib/themes/fonts';

interface ConsoleHandler {
  inputRef: MutableRefObject<HTMLTextAreaElement>;
  outputRef: MutableRefObject<HTMLDivElement>;

  clear(): void;

  write(s: string): void;

  read(): string;

  triggerFit(): void;
}

export default function useConsole(ready: boolean): ConsoleHandler {
  const
    inpRef = useRef<HTMLTextAreaElement>(),
    termRef = useRef<Terminal>(),
    fitRef = useRef<FitAddon>(),
    outRef = useRef<HTMLDivElement>();
  const triggerFit = useThrottle(
    () => {
      if (fitRef.current) fitRef.current.fit();
    }, 1e3);
  useEffect(() => {
    if (ready) {
      (async () => {
        if (!outRef.current) return;
        if (termRef.current)
          termRef.current.dispose();
        termRef.current = new Terminal({
          disableStdin: true,
          cursorStyle: 'underline',
          fontFamily: inconsolata,
          fontWeight: 500,
          fontSize: 16,
          scrollback: Number.MAX_SAFE_INTEGER,
          convertEol: true,
          theme: {
            foreground: 'white',
            background: '#1c1c1c',
            selectionBackground: '#2d2d2d'
          }
        });
        termRef.current.open(outRef.current);
        const canvas = new CanvasAddon();
        fitRef.current = new FitAddon();
        for (const addon of [canvas, fitRef.current])
          termRef.current.loadAddon(addon);
        fitRef.current.fit();
      })();
      return () => termRef.current.dispose();
    }
  }, [ready]);
  return {
    triggerFit,
    inputRef: inpRef,
    outputRef: outRef,
    clear() {
      if (termRef.current)
        termRef.current.reset();
    },
    write(s) {
      if (termRef.current)
        termRef.current.write(s);
    },
    read() {
      return inpRef.current.value || '';
    }
  };
}
