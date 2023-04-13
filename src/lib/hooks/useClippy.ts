import copy from 'copy-to-clipboard';
import useThrottle from 'lib/hooks/useThrottle';

interface ClippyHandler {
  copy(v: string): void;

  value(): Promise<string>;
}

export default function useClippy(): ClippyHandler {
  const setValue = useThrottle((s: string) => {
    copy(s);
  }, 5e2);
  return {
    copy(v: string) {
      setValue(v);
    },
    async value(): Promise<string> {
      return await navigator.clipboard.readText();
    }
  };
}
