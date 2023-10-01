import ReactMarkdown, {Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import {useEffect, useState} from 'react';
import NextLink from 'next/link';
import 'katex/dist/katex.min.css';
import rehypeKatex from 'rehype-katex';
import {
  chakra,
  ChakraProps,
  Code,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import CheckBox from 'components/CheckBox';
//import remarkCollapse from 'lib/extensions/remark/collapse';
import Prism from 'components/Prism';
import remarkGemoji from 'remark-gemoji';

export interface MarkdownProps extends ChakraProps {
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
        <Code fontFamily='mono' fontSize='85%' borderRadius='md' bg='gray.800'>
          {children}
        </Code>
      );
    const content = children.toString().replace(/\n$/, '');
    const language = (/language-(\w+)/.exec(className || 'unknown') || []).at(1);
    return (
      <Prism code={content} language={language} withTitle />
    );
  },
  input: ({children, checked, disabled}) => (
    <CheckBox alignItems='center' isChecked={checked} isDisabled={disabled}>
      {children}
    </CheckBox>
  )
};

const ChakraMarkdown = chakra(ReactMarkdown);

export default function Markdown({url, ...props}: MarkdownProps) {
  if (url.length === 0) return <></>;
  const [content, setContent] = useState('');
  useEffect(() => {
    if (url && url.length > 0)
      fetch(url).then(r => r.ok ? r.text() : '').then(setContent);
  }, [url]);
  return (
    <ChakraMarkdown display='flex' flexDirection='column' gap={4}
      remarkPlugins={[remarkGfm, remarkMath, remarkGemoji/*, remarkCollapse*/]}
      rehypePlugins={[rehypeKatex as any]}
      components={componentRenderers} p={4} {...props}>
      {content}
    </ChakraMarkdown>
  );
}
