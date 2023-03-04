import TextBox, {TextBoxProps} from 'components/TextBox';
import {FastField, useField} from 'formik';
import {FormControl, FormErrorMessage, forwardRef} from '@chakra-ui/react';

export default forwardRef<TextBoxProps, 'input'>(({name, ...props}: TextBoxProps, ref) => {
  const [, {error, touched}] = useField(name);
  return (
    <FormControl isInvalid={error && touched}>
      <FastField ref={ref} as={TextBox} name={name} {...props} />
      <FormErrorMessage fontSize='xs' fontWeight={600}>
        {error}
      </FormErrorMessage>
    </FormControl>
  );
});
