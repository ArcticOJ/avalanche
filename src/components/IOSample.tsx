import {Box, Heading, IconButton, VStack} from '@chakra-ui/react';
import {Clipboard} from 'react-feather';
import React from 'react';

export interface IOSampleProps {
  label: string;
  children: string;
}

export default function IOSample({label, children}: IOSampleProps) {
  return (
    <VStack align='stretch'>
      <Heading ml={2} size='sm'>
        {label}
      </Heading>
      <Box bg='gray.800' p={4} borderRadius='2xl' position='relative' fontWeight={600} fontSize={14}>
        <IconButton display='flex' aria-label='Copy to clipboard'
          position='absolute' right={4} top={4}>
          <Clipboard size={16} />
        </IconButton>
        <code>
          {children.split('\\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </code>
      </Box>
    </VStack>
  );
}
