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
import {Check, X} from 'react-feather';
import TextBox, {TextBoxProps} from 'components/TextBox';
import {FastField, useField} from 'formik';
import {createElement, useMemo} from 'react';
import {transition} from 'lib/utils';

const criterias = [
  {re: /^\S{6,}$/, label: 'Includes 6 characters and no whitespace'},
  {re: /\d/, label: 'Includes a digit'},
  {re: /[a-z]/, label: 'Includes a lowercase letter'},
  {re: /[A-Z]/, label: 'Includes a uppercase letter'},
  {re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes a special symbol'}];

function Criteria({result}) {
  return (
    <HStack color={`${result.result ? 'arctic' : 'red'}.200`}>
      {createElement(result.result ? Check : X,
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
  const isInvalid = useMemo(() => error && touched, [error, touched]);
  const [show, {on, off}] = useBoolean(false);
  const results = useMemo(() => criterias.map(f => ({
    result: f.re.test(value),
    label: f.label
  })), [value]);
  const progress = useMemo(() => results.filter(r => r.result).length / results.length * 100, [results]);
  return (
    <FormControl isInvalid={isInvalid}>
      <Collapse in={show} animateOpacity startingHeight={32}>
        <VStack spacing={4} align='stretch'>
          <FastField as={TextBox} type={type} autoComplete='new-password'
            name={name} onFocusCapture={on} onBlurCapture={off} {...props} />
          <Box bg='gray.700' px={4} pt={4} pb={2} borderRadius='xl'>
            <Progress transition={transition()} value={progress} colorScheme='arctic' borderRadius='xl' size='xs'
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
