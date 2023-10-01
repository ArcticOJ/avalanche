import {Box, Divider, Heading, IconButton, VStack} from '@chakra-ui/react';
import {IconCopy} from '@tabler/icons-react';
import React from 'react';
import KaTeX from 'components/KaTeX';

export interface IOSampleProps {
  num: number;
  input: string;
  output: string;
  note?: string;
}

function Block({label, children}) {
  return (
    <>
      <Heading ml={2} size='sm' as='h5'>
        {label}
      </Heading>
      <Box bg='gray.800' p={4} borderRadius='2xl' position='relative' fontWeight={600} fontSize='smaller'>
        <IconButton display='flex' aria-label='Copy to clipboard'
          position='absolute' right={3} top={3}>
          <IconCopy size={16} />
        </IconButton>
        <code>
          {children.split('\\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </code>
      </Box>
    </>
  );
}

export default function IOSample({num, input, output, note}: IOSampleProps) {
  return (
    <VStack align='stretch'>
      <Heading as='h4' size='md' mb={2}>
        Example test case {num}
      </Heading>
      <Block label='Input'>
        {input}
      </Block>
      <Block label='Output'>
        {output}
      </Block>
      {note && note != '' && (
        <>
          <Heading size='sm' as='h5' ml={2}>
            Note
          </Heading>
          <KaTeX size='xs' ml={4}>
            {note}
          </KaTeX>
        </>
      )}
      <Divider mt={4} />
    </VStack>
  )
  ;
}
