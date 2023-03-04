import {numberInputAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';

const {definePartsStyle, defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    stepperGroup: {
      h: 'calc(100% - 4px)',
      m: '2px'
    },
    stepper: {
      border: 'none',
      _hover: {
        bg: 'gray.800'
      },
      _active: {
        bg: 'gray.700'
      },
      _odd: {
        borderTopRightRadius: '0.65rem !important'
      },
      _even: {
        borderBottomRightRadius: '0.65rem !important'
      }
    },
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

