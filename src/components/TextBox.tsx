import type {InputProps} from '@chakra-ui/input';
import {InputRightElement} from '@chakra-ui/input';
import type {Icon} from 'react-feather';
import {Eye, EyeOff, Info} from 'react-feather';
import {forwardRef, IconButton, Input, InputGroup, InputLeftElement, Tooltip, useBoolean} from '@chakra-ui/react';
import {createElement} from 'react';

export interface TextBoxProps extends InputProps {
  children?: string;
  icon?: Icon;
  description?: string;
}

export default forwardRef<TextBoxProps, 'input'>(({
  icon,
  type,
  placeholder,
  children,
  description,
  ...inputProps
}, ref) => {
  const [isPassword, {toggle}] = useBoolean(true);
  return (
    <InputGroup size='sm' flex={1}>
      <InputLeftElement w={10}>
        {createElement(icon, {
          size: 16,
          color: 'var(--chakra-colors-arctic-100)'
        })}
      </InputLeftElement>
      <Input borderRadius='xl' focusBorderColor='arctic.300'
        ref={ref}
        name={inputProps.name}
        placeholder={placeholder} {...inputProps}
        type={isPassword && type === 'password' ? 'password' : type === 'password' ? 'text' : type}
        defaultValue={children}>
      </Input>
      <InputRightElement mr={1} color='arctic.100'>
        {description && (
          <Tooltip label={description}>
            <Info size={16} />
          </Tooltip>
        )}
        {type === 'password' && (
          <IconButton tabIndex={-1} aria-label='Show/hide password' borderRadius='full' h='20px' size='xs'
            onClick={toggle}
            variant={isPassword ? 'ghost' : 'solid'}
            colorScheme='arctic'>
            {isPassword ? <Eye size={12} /> : <EyeOff size={12} />}
          </IconButton>
        )}
      </InputRightElement>
    </InputGroup>
  );
});
