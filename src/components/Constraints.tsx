import {IconArrowsExchange, IconHourglass, IconServer2} from '@tabler/icons-react';
import {Box, HStack, Text} from '@chakra-ui/react';
import React, {createElement} from 'react';

export default function Constraints({mem, io, time}) {
  const constraints = [
    ['Time limit', time, IconHourglass],
    ['Memory', mem, IconServer2],
    ['IO', io, IconArrowsExchange]
  ];
  return (
    <Box float='right' color='arctic.300' p={4} bg='gray.800' shadow='md' borderRadius='xl'>
      {constraints.map(([label, value, icon], i) => (
        <HStack key={i}>
          {createElement(icon, {
            size: 16
          })}
          <Text fontSize='xs' fontWeight={600} color='gray.50'>{label}: </Text>
          <Text fontSize='xs' color='gray.50'>{value}</Text>
        </HStack>
      ))}
    </Box>
  );
}
