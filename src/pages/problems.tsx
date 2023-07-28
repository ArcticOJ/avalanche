import useFetch from 'lib/hooks/useFetch';
import {chakra, Divider, HStack, Table, Tag, Tbody, Td, Th, Thead, Tr, VStack} from '@chakra-ui/react';
import {IconSearch} from '@tabler/icons-react';
import {Problem} from 'lib/types/contests';
import React from 'react';
import {useRouter} from 'next/router';
import TextBox from 'components/TextBox';
import {transition} from 'lib/utils/common';

export default function Problems() {
  const {push} = useRouter();
  const {data} = useFetch<Problem[]>('/api/problems', {
    fallbackData: []
  });
  return (
    <VStack borderRadius='2xl' p={2} bg='gray.800' align='stretch' mx='auto' alignSelf='center'>
      <TextBox icon={IconSearch} placeholder='Find a problem' type='search' />
      <Divider />
      <Table>
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Tags</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(problem => (
            <chakra.button
              {...transition()}
              cursor='pointer'
              onClick={() => push(`/problem/${problem.id}`)}
              key={problem.id}
              _hover={{bg: 'gray.600'}}
              _active={{bg: 'gray.700'}}
              as='tr'>
              <Td>{problem.title}</Td>
              <Td>
                <HStack>
                  {problem.tags.map((tag, i) => (
                    <Tag key={problem.id + i} colorScheme='arctic' variant='solid'>
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
  );
}

Problems.displayName = 'problems';
