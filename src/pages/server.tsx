import {Box, Button, Divider, Heading, HStack, Spacer, Text, VStack, Wrap} from '@chakra-ui/react';
import type {Health} from 'lib/types/health';
import {round, transition} from 'lib/utils';
import useRequest from 'lib/hooks/useRequest';
import {Server} from 'react-feather';

function Item({lines, header, isCluster = false}) {
  return (
    <Box maxW={320} bg='gray.800' cursor='pointer' transition={transition()} borderRadius='2xl' px={4} pt={4} pb={2}
      _hover={{
        bg: 'gray.700'
      }} _active={{
        bg: 'gray.600'
      }} position='relative'>
      <Heading size='sm' textAlign='center'>{header}</Heading>
      <HStack my={isCluster && 2}>
        <Box alignSelf='center'>
          <Server />
        </Box>
        <Spacer />
        {isCluster && (
          <Button>
            View runtimes
          </Button>
        )}
      </HStack>
      {lines.map((l, i) => (
        <Text key={i} fontSize='sm'>
          <Text as='b'>{l.name}: </Text>
          <Text as='span'>
            {l.value}
          </Text>
        </Text>
      ))}
    </Box>
  );
}

export default function ServerPage() {
  const {data, latency} = useRequest<Health>('/api/health');
  return data && (
    <VStack align='stretch' m={4} spacing={6}>
      <Item header='API server' lines={[
        {
          name: 'Codename',
          value: 'Blizzard'
        },
        {
          name: 'Version',
          value: data.version
        },
        {
          name: 'Latency',
          value: `${round(latency, 3)} ms`
        }
      ]} />
      <VStack align='stretch'>
        <Heading size='md'>Clusters</Heading>
        <Divider />
        <Wrap spacing={4}>
          {data.judges.sort().map((judge, i) => (
            <Item key={i} header={judge.name} isCluster={true} lines={judge.isAlive ? [
              {
                name: 'Version',
                value: judge.version
              },
              {
                name: 'Latency',
                value: `${round(judge.latency, 3)} ms`
              },
              {
                name: 'Memory',
                value: `${round(judge.mem, 3)} GB`
              },
              {
                name: 'OS',
                value: judge.os
              },
              {
                name: 'CPU',
                value: judge.cpu
              }
            ] : []} />
          ))}
        </Wrap>
      </VStack>
    </VStack>
  );
}
