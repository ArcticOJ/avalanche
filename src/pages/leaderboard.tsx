import {Divider, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack} from '@chakra-ui/react';
import TextBox from 'components/TextBox';
import {IconSearch} from '@tabler/icons-react';
import React from 'react';
import useFetch from 'lib/hooks/useFetch';
import {resolveRating} from 'lib/utils/rating';

function Row({user, index}) {
  const ratingColor = resolveRating(user.rating).color;
  return (
    <Tr>
      <Td>{index + 1}</Td>
      <Td fontWeight='medium' color={ratingColor}>{user.rating}</Td>
      <Td color={ratingColor}>
        <div>
          <Flex gap={2}>
            <Text fontWeight='medium' fontSize='md' style={{color: user.roles?.[0]?.color}}>
              {user.handle}
            </Text>
            <Text>
              {user.roles?.[0]?.icon}
            </Text>
          </Flex>
          <Text color='gray.500' fontSize='sm'>
            {user.displayName}
          </Text>
        </div>
      </Td>
      <Td>0</Td>
    </Tr>
  );
}

export default function Leaderboard() {
  // TODO: disable auto revalidation for this
  const {data} = useFetch('/api/users', {
    fallbackData: []
  });
  return (
    <VStack borderRadius='2xl' p={2} my={6} mx={12} bg='gray.800'>
      <TextBox icon={IconSearch} placeholder='Find a user by handle or display name' type='search' />
      <Divider />
      <Table>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Rating</Th>
            <Th />
            <Th>Problems solved</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((user, i) => (
            <Row user={user} index={i} key={user.id} />
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}

Leaderboard.displayName = 'leaderboard';