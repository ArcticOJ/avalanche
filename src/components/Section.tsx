import {Icon} from 'react-feather';
import {createElement} from 'react';
import {Box, BoxProps, HStack, Text} from '@chakra-ui/react';

interface SectionProps extends BoxProps {
  title: string;
  icon?: Icon;
}

export default function Section({title, icon, children, ...props}: SectionProps) {
  return (
    <Box borderWidth={2} borderRadius='xl' borderColor='gray.800'>
      <HStack px={4} py={2} spacing={2}>
        {icon && createElement(icon, {
          size: 16
        })}
        <Text fontSize={15} fontWeight={600}>{title}</Text>
      </HStack>
      <Box {...props}>
        {children}
      </Box>
    </Box>
  );
}
