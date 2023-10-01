import {popoverAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';

const {definePartsStyle, defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(popoverAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    content: {
      border: 'none',
      borderRadius: 'xl',
      fontWeight: 'semibold',
      bg: 'gray.700',
      shadow: 'lg',
      color: 'gray.50'
    },
    header: {
      py: 2,
      px: 4,
      fontSize: 'sm',
      fontWeight: 'bold',
      textAlign: 'start',
      borderBottom: 'none'
    },
    arrow: {
      '--popper-arrow-bg': 'colors.gray.700',
      '--popper-arrow-shadow-color': 'colors.gray.700'
    }
  })
});

