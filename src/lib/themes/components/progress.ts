import {progressAnatomy} from '@chakra-ui/anatomy';
import {createMultiStyleConfigHelpers} from '@chakra-ui/react';
import {transition} from 'lib/utils/common';

const {definePartsStyle, defineMultiStyleConfig} =
  createMultiStyleConfigHelpers(progressAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    track: {
      borderRadius: 'xl',
      '&>div[role="progressbar"]': transition(.2, ['width'])
    }
  }),
  defaultProps: {
    colorScheme: 'arctic'
  }
});
