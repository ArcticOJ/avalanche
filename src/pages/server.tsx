import {Box, Button, Divider, Heading, HStack, Text, VStack, Wrap} from '@chakra-ui/react';
import type {Health} from 'lib/types/health';
import {round, transition} from 'lib/utils/common';
import useRequest from 'lib/hooks/useRequest';
import {IconInfoCircle, IconServer} from '@tabler/icons-react';
import Section from 'components/Section';
import PropertyTree from 'components/PropertyTree';
import dayjs from 'dayjs';

function Item({lines, header, isCluster = false}) {
  return (
    <Box maxW={320} bg='gray.800' cursor='pointer' transition={transition()} borderRadius='2xl' px={4} pt={4} pb={2}
      _hover={{
        bg: 'gray.700'
      }} _active={{
        bg: 'gray.600'
      }} position='relative'>
      <Heading size='sm' textAlign='center'>{header}</Heading>
      <Divider my={2} />
      <HStack my={isCluster && 2}>
        <Box alignSelf='center' mr={4}>
          <IconServer />
        </Box>
        <div>
          {lines.map((l, i) => (
            <Text key={i} fontSize='sm'>
              <Text as='b'>{l.name}: </Text>
              <Text as='span'>
                {l.value}
              </Text>
            </Text>
          ))}
        </div>
      </HStack>
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
        <Wrap spacing={4}>
          {data.judges.sort().map((judge, i) => (
            <Section title={judge.name} icon={IconServer} key={judge.name} display='flex' gap={2} w='100%'
              rightItem={<Button size='xs' leftIcon={<IconInfoCircle size={12} />}>Runtimes</Button>}>
              <PropertyTree properties={{
                'Version': judge.version,
                'OS': judge.os,
                'CPU': judge.cpu,
                'Memory': round(judge.mem, 3) + 'GB',
                'Latency': round(judge.latency, 3) + ' ms',
                'Uptime': dayjs().subtract(judge.uptime, 'second').toNow(true)
              }} />
              {/*<SimpleGrid flex={1} m={4} gap={4} minChildWidth='120px'>
                {judge.runtimes.map(rt => (
                  <Box borderRadius='xl' bg='gray.800' boxShadow='md' px={4} py={2} key={rt.key}>
                    {rt.name}
                    <br />
                    {rt.version}
                  </Box>
                ))}
              </SimpleGrid>*/}
            </Section>
          ))}
        </Wrap>
      </VStack>
    </VStack>
  );
}
