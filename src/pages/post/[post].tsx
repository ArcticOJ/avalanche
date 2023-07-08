import {transition} from 'lib/utils/common';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Spacer,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react';
import React, {lazy} from 'react';
import dayjs from 'dayjs';
import {IconMessage, IconShare3, IconThumbUp, IconThumbUpFilled} from '@tabler/icons-react';

const Markdown = lazy(() => import('components/Markdown'));

export default function Post() {
  return (
    <Card bg='gray.800' {...transition()} borderColor='gray.700' w={700} mx='auto' mt={8}
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
              {dayjs('12/12/2022').fromNow()} &bull; 2 mins read
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
        <Tooltip label='100 likes' placement='top' hasArrow>
          <Button leftIcon={false ? <IconThumbUp size={16} /> : <IconThumbUpFilled size={16} />}>
            Like
          </Button>
        </Tooltip>
        <Button leftIcon={<IconMessage size={16} />} variant='outline'>
          6 comments
        </Button>
        <Spacer />
        <Button leftIcon={<IconShare3 size={16} />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}