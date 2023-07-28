import nordDark from 'lib/themes/editor';
import 'xterm/css/xterm.css';
import {Box, Button, Flex, Spacer, useConst} from '@chakra-ui/react';
import React, {createElement, useEffect, useRef, useState} from 'react';
import {languages, languageTypes} from 'lib/constants/languages';
import {Compartment} from '@codemirror/state';
import {keymap} from '@codemirror/view';
import {vscodeKeymap} from '@replit/codemirror-vscode-keymap';
import {useCodeMirror} from 'lib/hooks/useCodeMirror';
import {basicSetup} from '@uiw/codemirror-extensions-basic-setup';
import ChakraSelect from 'components/ChakraSelect';
import {IconSend} from '@tabler/icons-react';
import useLocalStorage from 'lib/hooks/useLocalStorage';

interface CodeEditorProps {
  onSubmit(code: string, language: string);
}

export default function CodeEditor({onSubmit}: CodeEditorProps) {
  const languageConf = useConst(() => new Compartment());
  const ref = useRef<HTMLDivElement>();
  const langOptions = useConst(() => Object.entries(languages).map(([k, v]) => ({
    label: v.name,
    value: k,
    type: v.type,
    icon: createElement(languageTypes[v.type].icon, {
      size: 14
    })
  })));
  const {view} = useCodeMirror([
    nordDark,
    keymap.of(vscodeKeymap),
    languageConf.of(languageTypes['cpp'].ext()),
    basicSetup({
      bracketMatching: true,
      foldGutter: true,
      autocompletion: true,
      completionKeymap: true,
      searchKeymap: true
    })
  ], ref.current, 'Write your code here!');
  const {get, set} = useLocalStorage('arctic:favorite_language', '', false);
  const [language, setLanguage] = useState<typeof langOptions[number]>();
  useEffect(() => {
    if (view) {
      const l = get();
      setLanguage(langOptions.find(f => f.value === l) || langOptions[0]);
    }
  }, [view]);
  useEffect(() => {
    if (language && view) {
      view.dispatch({
        effects: [
          languageConf.reconfigure(languageTypes[language.type].ext())
        ]
      });
      set(language.value);
    }
  }, [language]);
  return (
    <Flex height='100%' flexDir='column'>
      <Flex p={2} bg='gray.800' align='center'>
        <ChakraSelect value={language} onChange={v => setLanguage(v as any)}
          options={langOptions} />
        <Spacer />
        <Button fontSize='smaller' rightIcon={<IconSend size={16} />} height='30px' onClick={() => {
          onSubmit(view.state.doc.toString(), language.value);
        }}>
          Submit
        </Button>
      </Flex>
      <Box ref={ref} flex={1} />
    </Flex>
  );
}
