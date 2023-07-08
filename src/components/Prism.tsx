import {Highlight, themes} from 'prism-react-renderer';
import {CSSProperties, useEffect, useState} from 'react';
import {classes} from 'lib/utils/common';
import styles from 'styles/Prism.module.scss';
import {Box, Button, Divider, HStack, Spacer, Text, useClipboard, useConst} from '@chakra-ui/react';
import {IconClipboardCheck, IconClipboardCopy} from '@tabler/icons-react';
import ChakraSelect from 'components/ChakraSelect';

interface PrismProps {
  withLineNumber?: boolean;
  code: string | Promise<string>;
  language: string;
  containerStyle?: CSSProperties;
}

export default function Prism({withLineNumber, code, language, containerStyle = {}}: PrismProps) {
  const [_code, setCode] = useState('');
  useEffect(() => {
    if (typeof code === 'string')
      setCode(code);
    else
      code.then(setCode);
  }, [code]);
  const {setValue, onCopy, hasCopied} = useClipboard('');
  const _themes = useConst(() => Object.keys(themes).map(t => ({
    label: t.replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase()),
    value: t
  })));
  const [theme, setTheme] = useState(_themes.find(t => t.value === 'vsDark') || _themes[0]);
  return (
    <Box fontFamily='mono' fontSize='md'>
      <HStack bg='gray.800' borderTopRadius='lg' pl={4} pr={2} py={1}>
        <Text fontWeight={700}>
          {language}
        </Text>
        <Spacer />
        <ChakraSelect options={_themes} onChange={setTheme} value={theme} />
        <Button leftIcon={hasCopied ? <IconClipboardCheck size={16} /> : <IconClipboardCopy size={16} />}
          colorScheme={hasCopied ? 'green' : 'arctic'} variant='ghost' onClick={() => {
            setValue(_code);
            onCopy();
          }}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      </HStack>
      <Divider />
      <Highlight code={_code}
        language={language} theme={themes[theme.value]}>
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={classes(className, styles.prism)} style={{
            padding: 8,
            ...style,
            ...containerStyle
          }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({line})}>
                {withLineNumber && (
                  <span className={styles.lineNumber}>{i + 1}</span>
                )}
                <span className={styles.lineContent}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token})} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
  );
}
