import {
  Button,
  ButtonGroup,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react';
import {ChevronDown, ChevronUp, Clipboard, Key, RefreshCw} from 'react-feather';
import TextBox from 'components/TextBox';
import {notify} from 'lib/notifications';
import useFetch from 'lib/hooks/useFetch';
import {request} from 'lib/utils';

export default function ProfileEdit() {
  const {data, mutate} = useFetch('/api/user/apiKey');
  return (
    <Flex m={4} gap={2}>
      <NumberInput size='sm' focusBorderColor='arctic.300'>
        <NumberInputField borderRadius='xl' />
        <NumberInputStepper>
          <NumberIncrementStepper>
            <ChevronUp size={12} />
          </NumberIncrementStepper>
          <NumberDecrementStepper>
            <ChevronDown size={12} />
          </NumberDecrementStepper>
        </NumberInputStepper>
      </NumberInput>
      <TextBox placeholder='API key' icon={Key} isReadOnly>
        {data ? data.apiKey : ''}
      </TextBox>
      <ButtonGroup isAttached>
        <Button leftIcon={<Clipboard size={16} />}
          onClick={() => notify('Hello World', <Button onClick={() => alert('uwu')} />)}>
          Copy
        </Button>
        <Button rightIcon={<RefreshCw size={16} />} onClick={() => {
          request({
            endpoint: '/api/user/apiKey',
            method: 'PATCH'
          }).finally(() => mutate(null, {
            rollbackOnError: false
          }));
        }}>
          Regenerate
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
