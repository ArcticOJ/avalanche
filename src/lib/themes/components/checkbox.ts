import {checkboxAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';
import {transition} from 'lib/utils';

const {definePartsStyle, defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    control: {
      transition: transition(),
      borderRadius: 'md',
      h: 4,
      w: 4
    },
    label: {
      fontSize: 13,
      fontWeight: 600
    }
  }),
  defaultProps: {
    colorScheme: 'arctic',
    size: 'sm'
  }
});

