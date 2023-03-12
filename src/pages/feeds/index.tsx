import useFetch from 'lib/hooks/useFetch';
import type {Feed} from 'lib/types/posts';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react';
import {ExternalLink, MessageSquare, Share2} from 'react-feather';
import NextLink from 'next/link';
import React from 'react';
import {transition} from 'lib/utils';
import dynamic from 'next/dynamic';

const Markdown = dynamic(() => import('components/Markdown'), {
  suspense: true,
  ssr: false
});

export default function Feeds() {
  const {data} = useFetch<Feed[]>('/api/feeds', {
    fallbackData: []
  });
  return (
    <Flex overflowY='auto' p={4} h='100%' gap={4} justify='center'>
      <VStack>
        {data.map(feed => (
          <Card bg='gray.800' transition={transition()} borderColor='gray.700' key={feed.id}
            borderRadius='2xl'>
            <CardHeader>
              <HStack spacing={4}>
                <Avatar src='https://goldor.dev/static/fav.png' size='sm' />
                <VStack alignItems='start' spacing={0}>
                  <Heading as='h6' size='xs'>
                    {feed.author.username}
                  </Heading>
                  <Text fontSize={13}>
                    {new Date(feed.timestamp).toLocaleDateString()} &bull; 2 mins read
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <Markdown url='/static/welcome.md' />
            </CardBody>
            <Divider />
            <CardFooter gap={2}>
              <Button leftIcon={<ExternalLink size={16} />} variant='ghost'>
                View
              </Button>
              <Spacer />
              <Button leftIcon={<MessageSquare size={16} />} variant='outline'>
                6 comments
              </Button>
              <Button leftIcon={<Share2 size={16} />}>
                Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </VStack>

      <VStack pos='sticky'>
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

Feeds.displayName = 'feeds';
