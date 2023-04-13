import {switchAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';

const {defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: {
    track: {
      p: 1,
      borderWidth: 2,
      borderColor: 'gray.500',
      bg: 'gray.700',
      _checked: {
        borderColor: 'transparent',
        bg: 'arctic.400'
      }
    },
    thumb: {
      bg: 'gray.500',
      transform: 'scale(0.8)',
      _checked: {
        bg: 'arctic.700'
      }
    }
  }
});
