import {Highlight, themes} from 'prism-react-renderer';
import {CSSProperties, useEffect, useState} from 'react';
import {classes} from 'lib/utils/common';
import styles from 'styles/Prism.module.scss';
import {Box, Button, Divider, HStack, Spacer, Text, useClipboard} from '@chakra-ui/react';
import {IconClipboardCheck, IconClipboardCopy} from '@tabler/icons-react';

interface PrismProps {
  withLineNumber?: boolean;
  code: string | Promise<string>;
  language: string;
  containerStyle?: CSSProperties;
  withTitle?: boolean;
}

export default function Prism({withLineNumber, code, language, withTitle, containerStyle = {}}: PrismProps) {
  const [_code, setCode] = useState('');
  useEffect(() => {
    if (typeof code === 'string')
      setCode(code);
    else
      code.then(setCode);
  }, [code]);
  const {setValue, onCopy, hasCopied} = useClipboard('');
  return (
    <Box fontFamily='mono' fontSize='md'>
      {withTitle && (
        <>
          <HStack bg='gray.800' borderTopRadius='lg' pl={4} pr={2} py={1}>
            <Text fontWeight={700}>
              {language}
            </Text>
            <Spacer />
            <Button leftIcon={hasCopied ? <IconClipboardCheck size={16} /> : <IconClipboardCopy size={16} />}
              colorScheme={hasCopied ? 'green' : 'arctic'} variant='ghost' onClick={() => {
                setValue(_code);
                onCopy();
              }}>
              {hasCopied ? 'Copied' : 'Copy'}
            </Button>
          </HStack>
          <Divider />
        </>
      )}
      <Highlight code={_code}
        language={language} theme={themes.vsDark}>
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
