import useFetch from 'lib/hooks/useFetch';
import type {Post} from 'lib/types/posts';
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  Tab, Tabs,
  Text,
  VStack
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, {lazy} from 'react';
import {transition} from 'lib/utils/common';
import {TabItem, TabItems} from 'components/TabItem';

const Markdown = lazy(() => import('components/Markdown'));

export default function Feeds() {
  const {data} = useFetch<Post[]>('/api/posts', {
    fallbackData: []
  });
  return (
    <Flex overflowY='auto' p={4} h='100%' gap={4} justify='center'>
      <VStack>
        {data.map(post => (
          <Card _hover={{
            bg: 'gray.700'
          }} _active={{
            bg: 'gray.600'
          }} bg='gray.800' cursor='pointer' {...transition()} borderColor='gray.700' key={post.id}
          borderRadius='2xl'>
            <CardHeader>
              <HStack spacing={4}>
                <Avatar src='https://goldor.dev/static/fav.png' size='sm' />
                <VStack alignItems='start' spacing={0}>
                  <Heading as='h6' size='xs'>
                    AlphaNecron
                    {/*feed.author.username*/}
                  </Heading>
                  <Text fontSize={13}>
                    {new Date(post.postedAt).toLocaleDateString()} &bull; 2 mins read
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <Markdown url='/static/welcome.md' />
            </CardBody>
          </Card>
        ))}
      </VStack>

      <VStack pos='sticky'>
        <Box textAlign='center' bg='gray.800' borderRadius='2xl' py={4} px={8}>
          <Heading size='xs' as='h6'>
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

Feeds.displayName = 'feeds';
