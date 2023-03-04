import {forwardRef, HStack, Tab, TabProps, Text} from '@chakra-ui/react';
import React, {createElement} from 'react';
import {Icon} from 'react-feather';

export interface TabIconProps extends TabProps {
  icon?: Icon;
}

export default forwardRef<TabIconProps, 'input'>(({
  icon,
  children,
  ...tabProps
}, ref) => {
  const hasIcon = !!icon;
  return (
    <Tab ref={ref} {...tabProps}>
      <HStack>
        {hasIcon && createElement(icon, {
          size: 16
        })}
        <Text noOfLines={1}>
          {children}
        </Text>
      </HStack>
    </Tab>
  );
});
