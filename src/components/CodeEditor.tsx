import ReactCodeMirror, {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import vscodeDark from 'lib/themes/editor';
import 'xterm/css/xterm.css';
import {Allotment} from 'allotment';
import styles from 'styles/CodeEditor.module.scss';
import {
  Icon,
  IconClipboard,
  IconCode,
  IconColumns2,
  IconCopy,
  IconCut,
  IconDownload,
  IconFileText,
  IconPlayerPlay,
  IconSend,
  IconSpace
} from '@tabler/icons-react';
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
  useConst,
  VStack
} from '@chakra-ui/react';
import useCompiler from 'lib/hooks/useCompiler';
import useConsole from 'lib/hooks/useConsole';
import React, {
  createElement,
  PropsWithChildren,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {languages, languageTypes} from 'lib/constants/languages';
import {Compartment} from '@codemirror/state';
import useClippy from 'lib/hooks/useClippy';
import useContextMenu from 'lib/hooks/useContextMenu';
import type {EditorView} from '@codemirror/view';
import {keymap} from '@codemirror/view';
import useSubmit from 'lib/hooks/useSubmit';
import {Verdict} from 'lib/types/submissions';
import {TabItem, TabItems} from 'components/TabItem';
import {transition} from 'lib/utils/common';
import SearchPanel from 'components/SearchPanel';
import useCodeCache from 'lib/hooks/useCodeCache';
import {vscodeKeymap} from '@replit/codemirror-vscode-keymap';
import arcticKeymap from 'lib/extensions/codemirror/keymap';

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
      {...transition(.15, ['background'])} {...props}>
      {icon && createElement(icon, {
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
  const languageConf = useConst(() => new Compartment());
  const editorRef = useRef<ReactCodeMirrorRef | undefined>(null);
  const [editorStats, setEditorStats] = useState({
    tabSize: 0,
    ln: 0,
    col: 0
  });
  const [searchOpened, setSearchOpened] = useState(false);
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
      icon: IconFileText,
      command: ['Ctrl', 'O'],
      async action() {
      }
    },
    {
      label: 'Save file',
      icon: IconDownload,
      command: ['Ctrl', 'S'],
      action() {
      }
    },
    {
      type: 'divider'
    },
    {
      label: 'Copy',
      icon: IconCopy,
      command: ['Ctrl', 'C'],
      action() {
        const state = editorRef?.current?.view?.state;
        const doc = state?.sliceDoc(state?.selection.main.from, state?.selection.main.to);
        if (doc)
          copy(doc);
      }
    },
    {
      label: 'Cut',
      icon: IconCut,
      command: ['Ctrl', 'X'],
      action() {
      }
    },
    {
      label: 'Paste',
      icon: IconClipboard,
      command: ['Ctrl', 'V'],
      async action() {
        const view = editorRef?.current?.view;
        view?.dispatch(view?.state.replaceSelection(await value()));
      }
    },
    {
      type: 'divider'
    },
    {
      label: 'Run',
      icon: IconPlayerPlay,
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
      return editorRef?.current?.view?.state.sliceDoc() || '';
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
      <Allotment vertical onChange={triggerFit}>
        <Allotment.Pane minSize={300}>
          <Flex direction='column' h='100%'>
            <ChakraEditor onStatistics={v => startTransition(() => setEditorStats({
              tabSize: v.tabSize,
              ln: v.line.number,
              col: v.selectionAsSingle.from - v.line.from
            }))} className={styles.editor} position='relative'
            onChange={save} flex={1} h='100%'
            extensions={[
              // TODO: override search panel
              arcticKeymap(() => {
                console.log('triggered');
                setSearchOpened(true);
              }),
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
              <SearchPanel isOpen={searchOpened} onClose={() => setSearchOpened(false)} editorRef={editorRef} />
              {menu}
            </ChakraEditor>
            <Flex bg='gray.800' minH='24px' h='24px' maxH='24px'>
              <StatusBarItem icon={IconCode} bg={{
                normal: 'arctic.600',
                active: 'arctic.500',
                hover: 'arctic.400'
              }}>
                Local compiler
              </StatusBarItem>
              <Spacer />
              <StatusBarItem icon={IconSpace}>
                {editorStats.tabSize} spaces
              </StatusBarItem>
              <StatusBarItem icon={IconColumns2}>
                Ln {editorStats.ln}, Col {editorStats.col}
              </StatusBarItem>
              <Menu>
                {/* TODO: optimize this */}
                <MenuButton as={StatusBarItem} icon={languageTypes[languages[language].type].icon}>
                  {languages[language].name}
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuOptionGroup type='radio' value={language}
                      onChange={(value: string) => setLanguage(value)}>
                      {Object.entries(languages).map(([id, lang]) => (
                        <MenuItemOption value={id} key={id}>
                          <Flex align='center'>
                            {lang.name}
                            <Spacer />
                            {createElement(languageTypes[lang.type].icon, {
                              size: 16
                            })}
                          </Flex>
                        </MenuItemOption>
                      ))}
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
                <Button leftIcon={<IconPlayerPlay size={12} />} variant='outline'
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
                <Button rightIcon={<IconSend size={12} />} isLoading={status !== Verdict.None}
                  loadingText={Verdict[status]}
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
                  transition={transition(0.1, ['background'])}
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
