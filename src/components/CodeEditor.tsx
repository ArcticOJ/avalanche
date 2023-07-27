import ReactCodeMirror, {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import vscodeDark from 'lib/themes/editor';
import 'xterm/css/xterm.css';
import {chakra, Flex, useConst} from '@chakra-ui/react';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {languages, languageTypes} from 'lib/constants/languages';
import {Compartment} from '@codemirror/state';
import type {EditorView} from '@codemirror/view';
import {keymap} from '@codemirror/view';
import useSubmit from 'lib/hooks/useSubmit';
import useCodeCache from 'lib/hooks/useCodeCache';
import {vscodeKeymap} from '@replit/codemirror-vscode-keymap';

const ChakraEditor = chakra(ReactCodeMirror);

export default function CodeEditor() {
  const languageConf = useConst(() => new Compartment());
  const editorRef = useRef<ReactCodeMirrorRef | undefined>(null);
  const [language, setLanguage] = useState('gnu++11');
  const {init, save} = useCodeCache();
  const {status, submit, submitModal} = useSubmit();
  const onLoad = useCallback(async (view: EditorView) => {
    await init(view);
  }, []);
  const languageType = useRef<typeof languageTypes[keyof typeof languageTypes]>(languageTypes['cpp']);
  useEffect(() => {
    if (!editorRef.current?.view) return;
    const lang = languages[language];
    if (lang)
      editorRef.current.view.dispatch({
        effects: languageConf.reconfigure(languageTypes[lang.type].ext())
      });
  }, [language]);
  return (
    <>
      {submitModal}
      <Flex direction='column' h='100%'>
        <ChakraEditor position='relative'
          onChange={save} flex={1} h='100%'
          extensions={[
            keymap.of(vscodeKeymap),
            languageConf.of(languageType.current.ext())
          ]}
          basicSetup={{
            bracketMatching: true,
            foldGutter: true,
            autocompletion: true,
            completionKeymap: true,
            searchKeymap: false,
            tabSize: 2
          }}
          placeholder='Write some code and press Run to compile.'
          overflow='auto' ref={editorRef}
          theme={vscodeDark}
          onCreateEditor={onLoad}>
        </ChakraEditor>
      </Flex>
    </>
  );
}
