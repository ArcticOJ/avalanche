import {useEffect, useState} from 'react';
import {Annotation, EditorSelection, EditorState, type Extension, StateEffect} from '@codemirror/state';
import {EditorView, placeholder, ViewUpdate} from '@codemirror/view';
import useCodeCache from 'lib/hooks/useCodeCache';
import useThrottle from 'lib/hooks/useThrottle';
import {indentUnit} from '@codemirror/language';

const External = Annotation.define<boolean>();

export function useCodeMirror(extensions: Extension[] = [], ctn: HTMLDivElement | null, _placeholder: string) {
  const [view, setView] = useState<EditorView>();
  const defaultThemeOption = EditorView.theme({
    '&': {
      fontSize: '15px !important',
      height: '100% !important'
    },
    '& .cm-content, & .cm-scroller': {
      height: '100% !important'
    },
    '& .cm-foldPlaceholder': {
      background: 'var(--chakra-colors-arctic-300)',
      color: 'var(--chakra-colors-gray-900)',
      border: 'none'
    }
  });
  const {load, save} = useCodeCache();
  const saveToLocalStorage = useThrottle((u: ViewUpdate) => {
    if (u.docChanged && !u.transactions.some((tr) => tr.annotation(External)))
      save(u.state.doc.toString(), u);
  }, 2e3, []);
  const listener = EditorView.updateListener.of(saveToLocalStorage);
  const ext = [listener, defaultThemeOption, placeholder(_placeholder), indentUnit.of('\t'), ...extensions];
  useEffect(() => {
    (async () => {
      if (ctn) {
        const initialState = load();
        let currentState: EditorState;
        if (initialState) {
          currentState = EditorState.fromJSON(JSON.parse(initialState.state), {
            extensions: ext
          }, initialState.fields);
        } else {
          const template = await fetch('/static/templates/cpp').then(r => r.ok ? r.text() : '');
          const pos = Math.max(template.indexOf('$END$'), 0);
          currentState = EditorState.create({
            extensions: ext,
            doc: template.replace('$END$', ''),
            selection: EditorSelection.create([EditorSelection.cursor(pos)])
          });
        }
        if (!view) {
          const viewCurrent = new EditorView({
            state: currentState,
            parent: ctn
          });
          setView(viewCurrent);
          viewCurrent.focus();
        }
      }
    })();
    return () => {
      if (view)
        setView(undefined);
    };
  }, [ctn]);

  useEffect(
    () => () => {
      if (view) {
        view.destroy();
        setView(undefined);
      }
    },
    [view]
  );

  useEffect(() => {
    if (view)
      view.dispatch({effects: StateEffect.reconfigure.of(ext)});
  }, [_placeholder]);

  return {view};
}