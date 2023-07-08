import {Button, Center, Heading, Text, VStack} from '@chakra-ui/react';
import {IconChevronLeft} from '@tabler/icons-react';
import NextLink from 'next/link';

export default function _404() {
  return (
    <Center h='100vh'>
      <VStack>
        <Heading
          fontSize={72}
          bgGradient='linear(to-tr, arctic.400, arctic.600)'
          backgroundClip='text'>404</Heading>
        <Text fontFamily='mono' fontSize='xl' fontWeight='semibold' mb={16}>
          This page does not exist, maybe try navigating to another one?
        </Text>
        <br />
        <Button leftIcon={<IconChevronLeft size={16} />} as={NextLink} href='/feeds'>
          Back to Feeds
        </Button>
      </VStack>
    </Center>
  );
}