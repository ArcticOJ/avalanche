import {Activity, Clock, Cpu} from 'react-feather';
import {Box, HStack, Text} from '@chakra-ui/react';
import React, {createElement} from 'react';

export default function Constraints({mem, cpu, time}) {
  const constraints = [
    ['Time limit', time, Clock],
    ['Memory', mem, Activity],
    ['CPU', cpu, Cpu]
  ];
  return (
    <Box float='right' color='arctic.300' p={4} bg='gray.800' shadow='md' borderRadius='xl'>
      {constraints.map(([label, value, icon], i) => (
        <HStack key={i}>
          {createElement(icon, {
            size: 12
          })}
          <Text fontSize='xs' fontWeight={600} color='gray.50'>{label}: </Text>
          <Text fontSize='xs' color='gray.50'>{value}</Text>
        </HStack>
      ))}
    </Box>
  );
}
