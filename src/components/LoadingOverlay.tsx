import {Center, Spinner} from '@chakra-ui/react';

export default function LoadingOverlay({fill = false, background = false}) {
  return (
    <Center h={fill ? '100vh' : '100%'} background={background && 'gray.700'}>
      <Spinner size='xl' color='arctic.300' />
    </Center>
  );
}