import {
  Box,
  Button,
  chakra, Container,
  Flex,
  forwardRef, HStack, Text,
  useBoolean,
  useMultiStyleConfig,
  useTab, useTabIndicator, useTabList, useTabs, useTabsStyles, useToken,
  VStack
} from '@chakra-ui/react';
import React, {createElement, useMemo} from 'react';
import {motion} from 'framer-motion';
import {TabIconProps} from './TabIcon';
import {transition} from 'lib/utils';

export const TabItems = forwardRef(({
  children, ...props
}, ref) => {
  const listProps = useTabList({...props, ref});
  const styles = useTabsStyles();
  return (
    <Flex gap={1} m={1} ref={ref} {...styles} {...listProps}>
      {children}
    </Flex>
  );
});

export const TabItem = forwardRef<TabIconProps, any>((props, ref) => {
  const tabProps = useTab({...props, ref});
  const id = tabProps.id.split(':')[1];
  const isSelected = !!tabProps['aria-selected'];
  const hasIcon = !!props.icon;
  const [arctic] = useToken('colors', ['arctic.200']);
  return (
    <VStack>
      <chakra.button borderRadius='md' _hover={{
        bg: 'gray.700'
      }} _active={{
        bg: 'gray.800'
      }} transition={transition(0.25)} fontSize='sm' h={hasIcon && 8} px={hasIcon ? 4 : 2}
      fontWeight={isSelected && 600} {...tabProps}>
        <HStack>
          {hasIcon && createElement(props.icon, {
            size: 16
          })}
          <Text noOfLines={1} textAlign='left'>
            {tabProps.children}
          </Text>
        </HStack>
      </chakra.button>
      {isSelected && (
        <motion.div layoutId={`${id}_indicator`}
          style={{
            width: '60%',
            height: 3,
            marginTop: 3,
            borderRadius: 2,
            background: arctic
          }} />
      )}
    </VStack>
  );
});
