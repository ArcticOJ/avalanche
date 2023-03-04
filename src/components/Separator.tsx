import {Container, Divider, DividerProps, Text} from '@chakra-ui/react';

export default function Separator({children, ...props}: DividerProps) {
  return (
    <Container position='relative'>
      <Divider w='100%' {...props} />
      <Text fontSize='xs' position='absolute' top={-2.5} left='50%' transform='translateX(-50%)' bg='gray.800'
        color='gray'
        px={1.5}>
        {children}
      </Text>
    </Container>
  );
}
