import {chakraComponents, Select} from 'chakra-react-select';
import React from 'react';
import {IconChevronDown} from '@tabler/icons-react';
import {forwardRef} from '@chakra-ui/react';
import type {GroupBase, Props} from 'react-select';
import type {SizeProp} from 'chakra-react-select/dist/types/types';

const components = {
  Option: ({children, ...props}) => (
    <chakraComponents.Option {...props as any}>
      {props.data.icon} {children}
    </chakraComponents.Option>
  ),
  LoadingIndicator: props => (
    <chakraComponents.LoadingIndicator color='arctic.300' spinnerSize='xs' {...props} />
  ),
  DropdownIndicator: props => (
    <chakraComponents.DropdownIndicator {...props as any}>
      <IconChevronDown size={16} />
    </chakraComponents.DropdownIndicator>
  )
};
const styles = {
  control: (provided) => ({
    ...provided,
    borderRadius: 'xl'
  }),
  menuList: (provided) => ({
    ...provided,
    '&:-webkit-scrollbar': {
      display: 'none'
    },
    minWidth: 'max-content',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    borderRadius: '2xl'
  }),
  option: (provided, state) => ({
    ...provided,
    '&:not(:last-child)': {
      mb: 1
    },
    gap: 2,
    _hover: {
      color: state.isSelected ? 'gray.900' : 'gray.50',
      bg: state.isSelected ? 'arctic.500' : 'gray.700'
    },
    p: '6px 16px'
  })
};


export default forwardRef(<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: Props<Option, IsMulti, Group>, ref) => (
    <>
      <Select
        {...props}
        ref={ref} selectedOptionColorScheme='arctic'
        size={'xs' as SizeProp}
        chakraStyles={styles} focusBorderColor='arctic.300' useBasicStyles components={components} />
    </>
  ));
