import {tabsAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';

const {definePartsStyle, defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    tab: {
      fontWeight: 600
    }
  }),
  variants: {
    enclosed: definePartsStyle({
      tablist: {
        borderBottomWidth: 2,
        borderBottomColor: 'gray.800'
      },
      tab: {
        _selected: {
          borderBottomWidth: 0,
          borderBottomRadius: 0,
          borderBottomColor: 'transparent',
          borderWidth: 2,
          borderColor: 'gray.800'
        }
      }
    }),
    filled: definePartsStyle({
      tab: {
        fontSize: 'sm',
        h: 8,
        borderRadius: 'xl',
        _hover: {
          bg: 'gray.700'
        },
        _selected: {
          bg: 'arctic.200',
          color: 'gray.900',
          _hover: {
            bg: 'arctic.300'
          },
          _active: {
            bg: 'arctic.400'
          }
        }
      }
    })
  }
});

