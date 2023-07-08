import {
  Box,
  Collapse,
  FormControl,
  FormErrorMessage,
  HStack,
  Progress,
  Text,
  useBoolean,
  VStack
} from '@chakra-ui/react';
import {IconCheck, IconX} from '@tabler/icons-react';
import TextBox, {TextBoxProps} from 'components/TextBox';
import {FastField, useField} from 'formik';
import {createElement} from 'react';

const criterias = [
  {re: /^\S{6,}$/, label: 'Includes 6 characters and no whitespace'},
  {re: /\d/, label: 'Includes a digit'},
  {re: /[a-z]/, label: 'Includes a lowercase letter'},
  {re: /[A-Z]/, label: 'Includes a uppercase letter'},
  {re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes a special symbol'}];

function Criteria({result}) {
  return (
    <HStack color={`${result.result ? 'arctic' : 'red'}.200`}>
      {createElement(result.result ? IconCheck : IconX,
        {
          size: 16
        })}
      <Text fontSize='xs' fontWeight={600}>
        {result.label}
      </Text>
    </HStack>
  );
}

export default function PasswordBox({type = 'password', name, ...props}: TextBoxProps) {
  const [{value}, {error, touched}] = useField(name);
  const isInvalid = error && touched;
  const [show, {on, off}] = useBoolean(false);
  const results = criterias.map(f => ({
    result: f.re.test(value),
    label: f.label
  }));
  const progress = results.filter(r => r.result).length / results.length * 100;
  return (
    <FormControl isInvalid={isInvalid}>
      <Collapse in={show} animateOpacity startingHeight={32}>
        <VStack spacing={4} align='stretch'>
          <FastField as={TextBox} type={type} autoComplete='new-password'
            name={name} onFocusCapture={on} onBlurCapture={off} {...props} />
          <Box bg='gray.700' px={4} pt={4} pb={2} borderRadius='xl'>
            <Progress value={progress}
              size='xs'
              mb={2} />
            <VStack align='stretch'>
              {results.map((c, i) => (
                <Criteria result={c} key={i} />
              ))}
            </VStack>
          </Box>
        </VStack>
      </Collapse>
      {!show && (
        <FormErrorMessage fontSize='xs' fontWeight={600}>
          {error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}
