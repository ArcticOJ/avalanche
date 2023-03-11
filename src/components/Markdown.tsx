import ReactMarkdown, {Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type {CSSProperties} from 'react';
import {useEffect, useState} from 'react';
import NextLink from 'next/link';
import 'katex/dist/katex.min.css';
import rehypeKatex from 'rehype-katex';
import {
  Box,
  Button,
  chakra,
  Code,
  Divider,
  Heading,
  HStack,
  Link,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useClipboard
} from '@chakra-ui/react';
import {Check, Copy} from 'react-feather';
import CheckBox from 'components/CheckBox';
import Prism from 'components/Prism';

export interface MarkdownProps {
  style?: CSSProperties;
  url: string;
}

const componentRenderers: Components = {
  a: ({children, href}) => (
    <Link href={href} as={NextLink} color='arctic.200'>
      {children}
    </Link>
  ),
  table: ({children}) => (
    <TableContainer>
      <Table variant='striped'>{children}</Table>
    </TableContainer>
  ),
  tr: Tr,
  thead: Thead,
  th: ({children}) => (
    <Th>{children}</Th>
  ),
  tbody: Tbody,
  td: ({children}) => (
    <Td>{children}</Td>
  ),
  h1: ({children}) => (
    <Heading size='2xl' as='h1'>
      {children}
    </Heading>
  ),
  h2: ({children}) => (
    <Heading size='xl' as='h2'>
      {children}
    </Heading>
  ),
  h3: ({children}) => (
    <Heading size='lg' as='h3'>
      {children}
    </Heading>
  ),
  h4: ({children}) => (
    <Heading size='md' as='h4'>
      {children}
    </Heading>
  ),
  h5: ({children}) => (
    <Heading size='sm' as='h5'>
      {children}
    </Heading>
  ),
  h6: ({children}) => (
    <Heading size='xs' as='h6'>
      {children}
    </Heading>
  ),
  code: ({children, inline, className}) => {
    if (inline)
      return (
        <Code fontFamily='"Inconsolata", monospace' fontSize={13} borderRadius='md' bg='gray.800'>
          {children}
        </Code>
      );
    const content = children.toString().replace(/\n$/, '');
    const language = (/language-(\w+)/.exec(className || 'unknown') || []).at(1);
    const {setValue, onCopy, hasCopied} = useClipboard('');
    return (

      <Box>
        <HStack bg='gray.800' borderTopRadius='lg' pl={4} pr={2} py={1} fontFamily='body'>
          <Text fontSize={14} fontWeight={700}>
            {language}
          </Text>
          <Spacer />
          <Button leftIcon={hasCopied ? <Check size={16} /> : <Copy size={16} />}
            colorScheme={hasCopied ? 'green' : 'arctic'} variant='ghost' onClick={() => {
              setValue(content);
              onCopy();
            }}>
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </HStack>
        <Divider />
        <Prism code={content} language={language} containerStyle={{
          padding: 8
        }} />
      </Box>
    );
  },
  input: ({children, checked, disabled}) => (
    <CheckBox alignItems='center' isChecked={checked} isDisabled={disabled}>
      {children}
    </CheckBox>
  )
};

const ChakraMarkdown = chakra(ReactMarkdown);

export default function Markdown({style = {}, url}: MarkdownProps) {
  if (url.length == 0) return <></>;
  const [content, setContent] = useState('');
  useEffect(() => {
    fetch(url).then(r => r.ok ? r.text() : '').then(setContent);
  }, []);
  return (
    <ChakraMarkdown display='flex' flexDirection='column' gap={4} remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={componentRenderers} p={4} sx={style}>
      {content}
    </ChakraMarkdown>
  );
}
