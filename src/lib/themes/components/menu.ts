import {menuAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';
import {transition} from 'lib/utils/common';

const {definePartsStyle, defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    list: {
      zIndex: 1000,
      p: 2,
      borderRadius: '2xl',
      border: 'none',
      bg: 'gray.800'
    },
    divider: {
      mx: 4,
      borderColor: 'gray.200'
    },
    item: {
      transition: transition(),
      borderRadius: 'xl',
      fontSize: 14,
      fontWeight: 600,
      color: 'white',
      bg: 'gray.800',
      _hover: {
        bg: 'gray.700'
      },
      '&:active': {
        bg: 'gray.600'
      }
    }
  })
});

