import {useCallback} from 'react';
import useLocalStorage from 'lib/hooks/useLocalStorage';
import {compress, decompress} from 'lzutf8';
import {historyField} from '@codemirror/commands';
import {EditorView, ViewUpdate} from '@codemirror/view';
import {EditorSelection, EditorState} from '@codemirror/state';
import {sleep} from 'lib/utils/common';
import {foldState} from '@codemirror/language';
import useThrottle from 'lib/hooks/useThrottle';

interface CacheHandler {
  save(doc: string, update: ViewUpdate): void;

  init(view: EditorView): Promise<void>;
}

const fields = {history: historyField, fold: foldState};

export default function useCodeCache(): CacheHandler {
  // TODO: per-problem code cache, using indexeddb

  const {set, get} = useLocalStorage('arctic:code', '', false);
  const save = useThrottle((_, update: ViewUpdate) =>
    set(compress(JSON.stringify(update.state.toJSON(fields)), {
      outputEncoding: 'Base64'
    })), 2e3);
  const init = useCallback(async (view: EditorView) => {
    view.focus();
    view.dom.focus();
    const state = decompress(get(), {
      inputEncoding: 'Base64',
      outputEncoding: 'String'
    });
    if (!state || state.length === 0) {
      const template = await fetch('/static/templates/cpp').then(r => r.ok ? r.text() : '');
      const pos = template.indexOf('$END$');
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: template.replace('$END$', '')
        },
        selection: EditorSelection.create([EditorSelection.cursor(pos)])
      });
    } else {
      await sleep(150);
      view.setState(EditorState.fromJSON(JSON.parse(state), {}, fields));
    }
  }, []);
  return {
    save,
    init
  };
}
