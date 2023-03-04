import NextLink from 'next/link';
import useFetch from 'lib/hooks/useFetch';
import {
  Box,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap
} from '@chakra-ui/react';
import {Search} from 'react-feather';
import {Problem} from 'lib/types/contests';
import React from 'react';
import {useRouter} from 'next/router';
import TextBox from 'components/TextBox';
import {transition} from 'lib/utils';

export default function Problems() {
  const {push} = useRouter();
  const {data} = useFetch<Problem[]>('/api/problems', {
    fallbackData: []
  });
  return (
    <Flex h='100%' gap={4} p={4} mx='auto' justify='center' align='start'>
      <VStack borderRadius='2xl' p={2} bg='gray.800' align='stretch'>
        <TextBox icon={Search} placeholder='Find a problem' type='search' />
        <Wrap>
          <Tag>
            easy
          </Tag>
          <Tag>
            beginner
          </Tag>
          <Tag>
            numbers
          </Tag>
          <Tag>
            strings
          </Tag>
        </Wrap>
        <Divider />
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Tags</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(problem => (
              <chakra.button
                transition={transition()}
                cursor='pointer'
                onClick={() => push(`/problems/${problem.id}`)}
                key={problem.id}
                _hover={{bg: 'gray.600'}}
                _active={{bg: 'gray.700'}}
                as='tr'>
                <Td>{problem.id}</Td>
                <Td>{problem.title}</Td>
                <Td>
                  <HStack>
                    {problem.tags.map(tag => (
                      <Tag key={tag} colorScheme='arctic' variant='solid'>
                        {tag}
                      </Tag>
                    ))}
                  </HStack>
                </Td>
              </chakra.button>
            ))}
          </Tbody>
        </Table>
      </VStack>
      <VStack>
        <Box textAlign='center' bg='gray.800' borderRadius='2xl' py={4} px={8}>
          <Heading size='xs'>
            Before contest
          </Heading>
          <Heading size='md' as={NextLink} href='/' color='arctic.400'>
            ICPC 2022 HCMC
          </Heading>
          <Heading size='sm'>
            2 days
          </Heading>
        </Box>
      </VStack>
    </Flex>
  );
}

Problems.displayName = 'problems';
