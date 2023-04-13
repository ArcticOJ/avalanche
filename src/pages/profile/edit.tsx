import {Button, ButtonGroup, Flex, Heading, Image, SimpleGrid, Text, VStack} from '@chakra-ui/react';
import {Clipboard, Key, Link, RefreshCw, X} from 'react-feather';
import TextBox from 'components/TextBox';
import {notify} from 'lib/notifications';
import useFetch from 'lib/hooks/useFetch';
import {createOAuthRequest, request} from 'lib/utils/common';
import copy from 'copy-to-clipboard';
import React, {createElement} from 'react';
import {resolveName} from 'lib/oauth/resolver';
import useRequiredAuth from 'lib/hooks/useRequiredAuth';

function OAuthConnection({provider, info, revalidate}) {
  const name = resolveName(provider);
  const isLinked = !!info;
  const onUnlink = () => {
    request({
      endpoint: `/api/oauth/${provider}/unlink?id=${info.id}`,
      method: 'DELETE'
    }).finally(revalidate);
  };
  const onLink = () => createOAuthRequest(provider, 'link');
  return (
    <Flex h={16} bg='gray.800' borderRadius='2xl' borderWidth={2} borderColor={isLinked ? 'green.300' : 'arctic.300'}
      alignItems='center' px={4} gap={4}>
      <Image src={`/static/logos/${provider}.svg`} filter='invert(1)' boxSize={8} alt={name} />
      <VStack spacing={0} flex={1} align='left'>
        <Heading as='h6' size='xs'>{name}</Heading>
        {isLinked && (
          <Text color='gray.300' fontSize={11}>
            {info.username}
          </Text>
        )}
      </VStack>
      <Button colorScheme={isLinked ? 'red' : 'arctic'} onClick={isLinked ? onUnlink : onLink}
        leftIcon={createElement(isLinked ? X : Link, {
          size: 16
        })}>
        {isLinked ? 'Unlink' : 'Link'}
      </Button>
    </Flex>
  );
}

export default function ProfileEdit() {
  useRequiredAuth();
  const {data, mutate} = useFetch('/api/user/apiKey', {
    fallbackData: {
      apiKey: ''
    }
  });
  const {data: oauthData, mutate: revalidateOauth} = useFetch<any>('/api/oauth', {
    revalidateOnFocus: false,
    fallbackData: {
      providers: [],
      connections: {}
    }
  });
  return (
    <VStack align='stretch' m={4}>
      <Flex gap={2}>
        {/*<NumberInput size='sm' focusBorderColor='arctic.300'>
        <NumberInputField borderRadius='xl' />
        <NumberInputStepper>
          <NumberIncrementStepper>
            <ChevronUp size={12} />
          </NumberIncrementStepper>
          <NumberDecrementStepper>
            <ChevronDown size={12} />
          </NumberDecrementStepper>
        </NumberInputStepper>
      </NumberInput>*/}
        {/* TODO: censor api key text box */}
        <TextBox type='password' placeholder='API key' icon={Key} isReadOnly sx={{
          textShadow: '0 0 5px rgba(0,0,0,0.5)'
        }} value={data.apiKey} />
        <ButtonGroup isAttached>
          <Button leftIcon={<Clipboard size={16} />}
            onClick={() => {
              if (data.apiKey != '') {
                copy(data.apiKey);
                notify('Copied to your clipboard', 'Never share this private key to anyone or they can access your account using this key on behalf of you.', 'warning');
              }
            }}>
            Copy
          </Button>
          <Button rightIcon={<RefreshCw size={16} />} onClick={async () => {
            const res = await request({
              endpoint: '/api/user/apiKey',
              method: 'PATCH'
            });
            if (!Object.hasOwn(res, 'apiKey')) {
              // TODO: handle regeneration error
              return;
            }
            await mutate(res, {
              revalidate: false,
              rollbackOnError: false
            });
          }}>
            Regenerate
          </Button>
        </ButtonGroup>
      </Flex>
      <SimpleGrid gap={2} minChildWidth={64}>
        {oauthData.providers.map(provider => (
          <OAuthConnection provider={provider} key={provider}
            info={Object.hasOwn(oauthData.connections, provider) && oauthData.connections[provider]}
            revalidate={() =>
              revalidateOauth({
                providers: [],
                connections: {}
              }, {
                rollbackOnError: false
              })} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
