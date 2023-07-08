import {Icon} from '@tabler/icons-react';
import {createElement, ReactElement} from 'react';
import {Box, BoxProps, HStack, Spacer, Text} from '@chakra-ui/react';

interface SectionProps extends BoxProps {
  title?: string;
  icon?: Icon;
  rightItem?: ReactElement;
}

export default function Section({title, icon, children, rightItem, ...props}: SectionProps) {
  return (
    <Box borderWidth={2} borderRadius='2xl' borderColor='gray.800'>
      {(title || icon) && (
        <HStack px={4} py={2} spacing={2}>
          {icon && createElement(icon, {
            size: 16
          })}
          {title && <Text fontSize={15} fontWeight={600}>{title}</Text>}
          <Spacer />
          {rightItem}
        </HStack>
      )}
      <Box {...props}>
        {children}
      </Box>
    </Box>
  );
}
