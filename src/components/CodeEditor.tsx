import ReactCodeMirror, {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import vscodeDark from 'lib/themes/editor';
import '@fontsource/inconsolata/500.css';
import 'xterm/css/xterm.css';
import {Allotment} from 'allotment';
import {
  CheckCircle,
  Clipboard,
  Code as CodeIcon,
  Copy,
  Download,
  FileText,
  Icon,
  Play,
  Scissors,
  Send
} from 'react-feather';
import {
  Button,
  ButtonGroup,
  Center,
  chakra,
  Code,
  Flex,
  forwardRef,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
  Spacer,
  Spinner,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react';
import useCompiler from 'lib/hooks/useCompiler';
import useConsole from 'lib/hooks/useConsole';
import React, {createElement, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {editorLanguages, languageDefinitions, languages} from 'lib/constants';
import {Compartment} from '@codemirror/state';
import useClippy from 'lib/hooks/useClippy';
import useContextMenu from 'lib/hooks/useContextMenu';
import type {EditorView} from '@codemirror/view';
import useSubmit from 'lib/hooks/useSubmit';
import {Verdict} from 'lib/types/submissions';
import {TabItem, TabItems} from 'components/TabItem';
import {transition} from 'lib/utils/common';
import SearchPanel from 'components/SearchPanel';
import useCodeCache from 'lib/hooks/useCodeCache';

interface MenuBarAction {
  icon: Icon;
  bg?: {
    normal: string;
    hover: string;
    active: string;
  };

  onInvoke?();
}

function statusColor(status: string) {
  let color = 'arctic';
  if (status === 'error')
    color = 'red';
  else if (status === 'success')
    color = 'green';
  else if (status === 'warning')
    color = 'yellow';
  return {
    normal: `${color}.600`,
    hover: `${color}.500`,
    active: `${color}.400`
  };
}

const StatusBarItem = forwardRef<PropsWithChildren<MenuBarAction>, 'button'>(({
  children,
  icon,
  bg = {
    normal: 'gray.800',
    hover: 'gray.700',
    active: 'gray.600'
  },
  onInvoke,
  ...props
}, ref) =>
  (
    <chakra.button display='flex' alignItems='center' gap={2} fontSize='11px' onClick={onInvoke} fontWeight={600} px={2}
      w='fit-content'
      ref={ref}
      bg={bg.normal} h='100%'
      _hover={{
        bg: bg.hover
      }}
      _active={{
        bg: bg.active
      }}
      transition={transition(0.15)} {...props}>
      {createElement(icon, {
        size: 16
      })}
      <Text lineHeight={0}>
        {children}
      </Text>
    </chakra.button>
  ));

const ChakraEditor = chakra(ReactCodeMirror);

function handleOnSave(e) {
  if (e.key === 's' && (/mac os x/i.test(navigator.userAgent) ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    alert('captured');
  }
}

export default function CodeEditor() {
  const languageConf = useMemo(() => new Compartment(), []);
  const editorRef = useRef<ReactCodeMirrorRef>();
  const searchPanelRef = useRef<HTMLElement>();
  // TODO: make searchPanel, contextMenu and autoSave extensions.
  const [tab, setTab] = useState(1);
  const [language, setLanguage] = useState('gnu++11');
  const {copy, value} = useClippy();
  const {init, save} = useCodeCache();
  useEffect(() => {
    document.addEventListener('keydown', handleOnSave, false);
    return () => document.removeEventListener('keydown', handleOnSave, false);
  }, []);
  const {menu, bind} = useContextMenu([
    {
      label: 'Open file',
      icon: FileText,
      command: ['Ctrl', 'O'],
      async action() {
      }
    },
    {
      label: 'Save file',
      icon: Download,
      command: ['Ctrl', 'S'],
      action() {
      }
    },
    {
      type: 'divider'
    },
    {
      label: 'Copy',
      icon: Copy,
      command: ['Ctrl', 'C'],
      action() {
        const state = editorRef.current.view.state;
        copy(state.sliceDoc(state.selection.main.from, state.selection.main.to));
      }
    },
    {
      label: 'Cut',
      icon: Scissors,
      command: ['Ctrl', 'X'],
      action() {
      }
    },
    {
      label: 'Paste',
      icon: Clipboard,
      command: ['Ctrl', 'V'],
      async action() {
        const view = editorRef.current.view;
        view.dispatch(view.state.replaceSelection(await value()));
      }
    },
    {
      type: 'divider'
    },
    {
      label: 'Run',
      icon: Play,
      command: ['Ctrl', 'E'],
      action() {
        setTab(1);
        clear();
        compile(language);
      }
    }
  ]);
  const {enabled, ready, compile, enable, running, abort} = useCompiler({
    stdin(): string {
      return read();
    },
    content(): string {
      return editorRef.current.view.state.sliceDoc();
    },
    stdout(s) {
      write(s);
    }
  });
  const {inputRef, outputRef, write, read, clear, triggerFit} = useConsole(ready);
  //  const {load, save} = useCodeCache();
  const {status, submit, submitModal} = useSubmit();
  const onLoad = useCallback(async (view: EditorView) => {
    await init(view);
    // TODO: create templates.json for all templates
    bind(view.dom);
  }, []);
  return (
    <>
      {submitModal}
      <Allotment vertical onChange={triggerFit}>
        <Allotment.Pane minSize={300}>
          <Flex direction='column' h='100%'>
            <ChakraEditor position='relative' onChange={save} flex={1} h='100%'
              extensions={[
                // TODO: override search panel
                languageConf.of(languageDefinitions['cpp']())
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
              <SearchPanel editorRef={editorRef} />
              {menu}
            </ChakraEditor>
            <Flex bg='gray.800' minH='24px' h='24px' maxH='24px'>
              {/* TODO: Make this working */}
              <StatusBarItem bg={statusColor('arctic')} icon={CheckCircle}>
                Successfully compiled
              </StatusBarItem>
              <Spacer />
              <Menu>
                <MenuButton as={StatusBarItem} icon={CodeIcon}>
                  {languages[language]}
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuOptionGroup type='radio' value={language}
                      onChange={(value: string) => {
                        const lang = Object.entries(editorLanguages).find(([_, l]) => l.includes(value)).shift();
                        if (typeof lang === 'string')
                          editorRef.current.view.dispatch({
                            effects: languageConf.reconfigure(languageDefinitions[lang]())
                          });
                        setLanguage(value);
                      }}>
                      {Object.entries(languages).map(([id, label]) => <MenuItemOption value={id} key={id}>
                        {label}
                      </MenuItemOption>)}
                    </MenuOptionGroup>
                  </MenuList>
                </Portal>
              </Menu>
            </Flex>
          </Flex>
        </Allotment.Pane>
        <Allotment.Pane minSize={300} preferredSize={300}>
          <Tabs colorScheme='arctic' size='sm' index={tab} onChange={setTab} h='100%'>
            <TabItems>
              <TabItem>
                Input
              </TabItem>
              <TabItem>
                Output
              </TabItem>
              <Spacer />
              <ButtonGroup isAttached size='xs' px={1} alignSelf='center'>
                <Button leftIcon={<Play size={12} />} variant='outline' borderRadius='lg'
                  isDisabled={!enabled}
                  loadingText='Initializing'
                  isLoading={!ready && enabled}
                  onClick={() => {
                    setTab(1);
                    if (!running) {
                      clear();
                      compile(language);
                    } else {
                      abort();
                    }
                  }}>
                  {enabled ? (running ? 'Stop' : 'Run') : 'Unavailable'}
                </Button>
                <Button rightIcon={<Send size={12} />} isLoading={status !== Verdict.None}
                  loadingText={Verdict[status]} borderRadius='lg'
                  onClick={async () => {
                    await submit();
                  }}>
                  Submit
                </Button>
              </ButtonGroup>
            </TabItems>
            <TabPanels sx={{
              h: '100%',
              '&>div': {
                h: '100%'
              }
            }}>
              {!(enabled && ready) && <Center h='100%' w='100%' position='absolute' bg='gray.900'>
                {enabled ? (
                  <VStack spacing={8}>
                    <Spinner size='xl' color='arctic.200' />
                    <Text>
                      Initializing <Code>clang</Code> compiler.
                    </Text>
                  </VStack>
                ) : (
                  <VStack>
                    <Text>
                      C++ compiler is not enabled, do you want to enable it now?
                    </Text>
                    <Text fontSize={11}>
                      Memory usage and network bandwidth might increase noticeably when loading the compiler!
                    </Text>
                    <Button onClick={enable} isLoading={enabled && !ready}>
                      Enable C++ compiler
                    </Button>
                  </VStack>
                )}
              </Center>}
              <TabPanel p={0}>
                <chakra.textarea placeholder='Type your input here' bg='gray.900' ref={inputRef} px={4} py={2} mb={40}
                  resize='none' outline='none' h='100%'
                  boxSizing='border-box'
                  w='100%'
                  _hover={{
                    bg: 'gray.800'
                  }}
                  _focus={{
                    bg: 'gray.800'
                  }}
                  _active={{
                    bg: 'gray.700'
                  }}
                  transition={transition(0.1)}
                  fontWeight={600}
                  fontSize={14}
                  overflow='auto' />
              </TabPanel>
              <TabPanel p={0}>
                <div ref={outputRef} style={{
                  width: '100%',
                  height: '100%'
                }} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Allotment.Pane>
      </Allotment>
    </>
  );
}
