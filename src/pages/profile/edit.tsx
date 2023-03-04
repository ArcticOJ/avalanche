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

export default function ProfileEdit() {
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
        Test
      </TextBox>
      <ButtonGroup isAttached>
        <Button leftIcon={<Clipboard size={16} />}
          onClick={() => notify('Hello World', <Button onClick={() => alert('uwu')} />)}>
          Copy
        </Button>
        <Button rightIcon={<RefreshCw size={16} />}>
          Reset
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
