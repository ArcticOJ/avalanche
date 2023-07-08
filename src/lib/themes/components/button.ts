import {defineStyleConfig} from '@chakra-ui/react';

export default defineStyleConfig({
  sizes: {
    xs: {
      borderRadius: 'lg'
    },
    sm: {
      borderRadius: 'xl'
    },
    md: {
      borderRadius: '2xl'
    },
    lg: {
      borderRadius: '3xl'
    }
  },
  defaultProps: {
    colorScheme: 'arctic',
    size: 'sm'
  }
});

