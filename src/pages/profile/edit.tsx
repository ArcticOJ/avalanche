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
      {/* TODO: censor api key text box */}
      <TextBox placeholder='API key' icon={Key} isReadOnly sx={{
        textShadow: '0 0 5px rgba(0,0,0,0.5)'
      }} value={data ? data.apiKey : ''} />
      <ButtonGroup isAttached>
        <Button leftIcon={<Clipboard size={16} />}
          onClick={() => notify('Hello World', <Button onClick={() => alert('uwu')} />)}>
          Copy
        </Button>
        <Button rightIcon={<RefreshCw size={16} />} onClick={async () => {
          const res = await request({
            endpoint: '/api/user/apiKey',
            method: 'PATCH'
          });
          if (!(res && res.hasOwnProperty('apiKey'))) {
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
  );
}
