import {defineStyleConfig} from '@chakra-ui/react';

export default defineStyleConfig({
  baseStyle: {
    zIndex: 1e6,
    borderRadius: 'xl',
    py: 2,
    px: 4,
    fontWeight: 600,
    bg: 'gray.700',
    color: 'gray.50',
    '.chakra-tooltip__arrow': {
      '--popper-arrow-bg': 'colors.gray.700'
    }
  }
});
