import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  VStack,
  Wrap
} from '@chakra-ui/react';
import {prettyBytes, round, transition} from 'lib/utils/common';
import useRequest from 'lib/hooks/useRequest';
import {IconInfoCircle, IconServer} from '@tabler/icons-react';
import Section from 'components/Section';
import PropertyTree from 'components/PropertyTree';
import dayjs from 'dayjs';
import {Status} from 'lib/types/status';

function Item({lines, header}) {
  return (
    <Box maxW={320} bg='gray.800' cursor='pointer' transition={transition()} borderRadius='2xl' px={4} pt={4} pb={2}
      _hover={{
        bg: 'gray.700'
      }} _active={{
        bg: 'gray.600'
      }} position='relative'>
      <Heading size='sm' textAlign='center'>{header}</Heading>
      <Divider my={2} />
      <HStack>
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
  const {data, latency} = useRequest<Status>('/api/status');
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
        <Heading size='md'>Machines</Heading>
        <Wrap spacing={4}>
          {Object.entries(data.judges).sort((a, b) => a[0].localeCompare(b[0])).map(([id, judge], i) => (
            <Section bg='gray.800' title={id} icon={IconServer} key={i}
              w='100%'
              rightItem={
                <Popover isLazy placement='bottom-end' preventOverflow={false}>
                  <PopoverTrigger>
                    <Button size='xs' leftIcon={<IconInfoCircle size={12} />}>Runtimes</Button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody as={Wrap}>
                        <PropertyTree
                          properties={Object.fromEntries(judge.runtimes.map(rt => [rt.name, (
                            <Text fontSize='xs' key={rt.id}>
                              <p>{rt.compiler} {rt.version}</p>
                              <p>{rt.arguments}</p>
                            </Text>
                          )]))} />
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              }>
              <PropertyTree properties={{
                'Version': '0.0.1-prealpha',
                'OS': judge.info.os,
                'Memory': prettyBytes(judge.info.memory, 1),
                'Uptime': dayjs(judge.info.bootedSince * 1e3).toNow(true),
                'Capacity': `${judge.info.parallelism} concurrent submission(s)`
              }} />
            </Section>
          ))}
        </Wrap>
      </VStack>
    </VStack>
  );
}
