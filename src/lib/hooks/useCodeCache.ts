import {useCallback} from 'react';
import useLocalStorage from 'lib/hooks/useLocalStorage';
import {compress, decompress} from 'lzutf8';
import {historyField} from '@codemirror/commands';
import {ViewUpdate} from '@codemirror/view';
import {foldState} from '@codemirror/language';

interface State {
  state: string;
  fields: typeof fields;
}

interface CacheHandler {
  save(doc: string, update: ViewUpdate): void;

  load(): State | null;
}

const fields = {history: historyField, fold: foldState};

export default function useCodeCache(): CacheHandler {
  // TODO: per-problem code cache, using indexeddb

  const {setPreferredLang, getPreferredLang} = useLocalStorage('arctic:code', '', false);
  const save = useCallback((_, update: ViewUpdate) =>
    setPreferredLang(compress(JSON.stringify(update.state.toJSON(fields)), {
      outputEncoding: 'Base64'
    })), []);
  const load = useCallback(() => {
    const state = decompress(getPreferredLang(), {
      inputEncoding: 'Base64',
      outputEncoding: 'String'
    }) as string;
    return (!state || state.length === 0) ? null : {
      state,
      fields
    };
  }, []);
  return {
    save,
    load
  };
}
