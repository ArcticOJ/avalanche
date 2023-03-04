import {inputAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';

const {definePartsStyle, defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    field: {
      fontSize: 12,
      fontWeight: 600
    }
  }),
  defaultProps: {
    colorScheme: 'arctic',
    variant: 'filled'
  }
});

