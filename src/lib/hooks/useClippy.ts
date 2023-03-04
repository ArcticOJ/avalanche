import {useCallback} from 'react';
import throttle from 'lodash.throttle';
import copy from 'copy-to-clipboard';

interface ClippyHandler {
  copy(v: string): void;

  value(): Promise<string>;
}

export default function useClippy(): ClippyHandler {
  const setValue = useCallback(throttle((s: string) => {
    copy(s);
  }, 1e3, {
    leading: true
  }), []);
  return {
    copy(v: string) {
      setValue(v);
    },
    async value(): Promise<string> {
      return await navigator.clipboard.readText();
    }
  };
}
