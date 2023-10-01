import {useEffect, useState} from 'react';
import {Annotation, Compartment, EditorSelection, EditorState, type Extension, StateEffect} from '@codemirror/state';
import {EditorView, keymap, placeholder, ViewUpdate} from '@codemirror/view';
import useCodeCache from 'lib/hooks/useCodeCache';
import useThrottle from 'lib/hooks/useThrottle';
import {indentUnit} from '@codemirror/language';
import {useConst} from '@chakra-ui/react';
import nordDark from 'lib/themes/editor';
import {vscodeKeymap} from '@replit/codemirror-vscode-keymap';
import {languages, languageTypes} from 'lib/constants/languages';
import {basicSetup} from '@uiw/codemirror-extensions-basic-setup';
import useLocalStorage from 'lib/hooks/useLocalStorage';

const External = Annotation.define<boolean>();

const defaultThemeOption = EditorView.theme({
  '&': {
    fontSize: '15px !important',
    height: '100% !important'
  },
  '.cm-content, .cm-scroller': {
    height: '100% !important'
  },
  '.cm-foldPlaceholder': {
    background: 'var(--chakra-colors-arctic-300)',
    color: 'var(--chakra-colors-gray-900)',
    padding: '0 4px',
    border: 'none'
  }
});

const defaultExtensions = [
  nordDark,
  keymap.of(vscodeKeymap),
  basicSetup({
    bracketMatching: true,
    foldGutter: true,
    autocompletion: true,
    completionKeymap: true,
    searchKeymap: true
  })
];

const languageConf = new Compartment();

const disableDragDropExt = EditorView.domEventHandlers({
  drop(e) {
    e.preventDefault();
  }
});

export function useCodeEditor(extensions: Extension[], ctn: HTMLDivElement | null, _placeholder?: string, value?: string, disableDragDrop?: boolean) {
  const [view, setView] = useState<EditorView>();
  const {load, save} = useCodeCache();
  const [language, setLanguage] = useState<string>();
  const saveToLocalStorage = useThrottle((u: ViewUpdate) => {
    if (u.docChanged && !u.transactions.some((tr) => tr.annotation(External)))
      save(u.state.doc.toString(), u);
  }, 2e3, []);
  const listener = useConst(() => EditorView.updateListener.of(saveToLocalStorage));
  const ext = [...defaultExtensions, listener, defaultThemeOption, placeholder(_placeholder), indentUnit.of('\t'), ...extensions];
  useEffect(() => {
    if (view && language) {
      const l = languages[language];
      if (!l) return;
      view.dispatch({
        effects: [
          languageConf.reconfigure(languageTypes[l.type].ext())
        ],
        annotations: [External.of(true)]
      });
      setPreferredLang(language);
    }
  }, [language]);
  const {getPreferredLang, setPreferredLang} = useLocalStorage('arctic:preferred_language', '', false);
  useEffect(() => {
    (async () => {
      if (ctn) {
        const initialState = load();
        const pl = getPreferredLang();
        let l = languages[pl];
        if (!l) l = Object.values(languages)[0];
        setLanguage(pl);
        const _ext = [...ext, languageConf.of(languageTypes[l.type].ext())];
        if (disableDragDrop) {
          _ext.push(disableDragDropExt);
        }
        let currentState: EditorState;
        if (initialState) {
          currentState = EditorState.fromJSON(JSON.parse(initialState.state), {
            extensions: _ext
          }, initialState.fields);
        } else {
          const template = await fetch('/static/templates/cpp').then(r => r.ok ? r.text() : '');
          const pos = Math.max(template.indexOf('$END$'), 0);
          currentState = EditorState.create({
            extensions: _ext,
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
      if (view) {
        view.destroy();
        setView(undefined);
      }
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

  useEffect(() => {
    if (!value || value === '')
      return;
    const currentValue = view ? view.state.doc.toString() : '';
    if (view && value !== currentValue) {
      view.dispatch({
        changes: {from: 0, to: currentValue.length, insert: value || ''},
        annotations: [External.of(true)]
      });
    }
  }, [view, value]);

  return {view, language, setLanguage};
}