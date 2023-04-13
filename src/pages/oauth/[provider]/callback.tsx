import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {request} from 'lib/utils/common';
import {Avatar, Center, Heading, Spinner, Text, VStack} from '@chakra-ui/react';
import {useAuth} from 'lib/hooks/useAuth';

type Status = {
  status: 'loading';
} | {
  status: 'success';
  data: {
    action: string;
    user: {
      username: string;
      id: string;
      avatar: string;
    }
  };
} | {
  status: 'failed';
  data: Error;
}

export default function Callback() {
  const [status, setStatus] = useState<Status>({
    status: 'loading'
  });
  const {revalidate} = useAuth();
  const {push, isReady, query: {provider, code, state}} = useRouter();
  useEffect(() => {
    (async () => {
      if (isReady) {
        if (!(provider && code && state)) {
          await push('/');
          return;
        }
        try {
          const res = await request({
            endpoint: `/api/oauth/${provider}/validate`,
            method: 'POST',
            body: {
              code,
              state
            }
          });
          if (res.action === 'login')
            revalidate().then(() => push('/'));
          setStatus({
            status: 'success',
            data: res
          });
        } catch (e) {
          console.log(e);
          setStatus({
            status: 'failed',
            data: e
          });
        }
      }
    })();
  }, [isReady]);
  return (
    <Center h='100%'>
      <VStack bg='gray.800' borderRadius='2xl' px={6} py={4}>
        {status.status === 'loading' ? (
          <Spinner size='lg' />
        ) : status.status === 'success' ? (
          <>
            <Heading>Success</Heading>
            <Avatar src={status.data.user.avatar} boxSize='128px' size='lg' />
            <Text>Successfully linked your account to {status.data.user.username}</Text>
          </>
        ) : (
          <>
            <Heading as='h4' size='md'>Failed to process OAuth request.</Heading>
            <Text>{status.data.message}</Text>
          </>
        )}
      </VStack>
    </Center>
  );
}
