import type {InputProps} from '@chakra-ui/input';
import {InputRightElement} from '@chakra-ui/input';
import type {Icon} from 'react-feather';
import {Eye, EyeOff, Info} from 'react-feather';
import {
  forwardRef,
  IconButton,
  IconButtonProps,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  useBoolean
} from '@chakra-ui/react';
import {createElement, ReactElement} from 'react';

export interface TextBoxProps extends InputProps {
  children?: string;
  icon?: Icon;
  description?: string;
  rightElement?: ReactElement;
}

export function TextBoxButton({icon, ...props}: Omit<IconButtonProps, 'icon'> & {
  icon: Icon
}) {
  return (
    <IconButton tabIndex={-1} borderRadius='full' h='20px' size='xs'
      colorScheme='arctic' {...props}>
      {icon && createElement(icon, {
        size: 12
      })}
    </IconButton>
  );
}

export default forwardRef<TextBoxProps, 'input'>(({
  icon,
  type,
  placeholder,
  children,
  description,
  isReadOnly,
  rightElement,
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
        isReadOnly={isReadOnly}
        defaultValue={children}>
      </Input>
      {(description || type === 'password' || rightElement) && (
        <InputRightElement mr={1} color='arctic.100'>
          {description && (
            <Tooltip label={description}>
              <Info size={16} />
            </Tooltip>
          )}
          {type === 'password' && (
            <TextBoxButton onClick={toggle} aria-label='Show/hide password'
              variant={isPassword ? 'ghost' : 'solid'} icon={isPassword ? Eye : EyeOff} />
          )}
          {rightElement}
        </InputRightElement>
      )}
    </InputGroup>
  );
});
