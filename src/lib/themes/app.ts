import {ChakraTheme, extendTheme} from '@chakra-ui/react';

import menuTheme from 'lib/themes/components/menu';
import tabsTheme from 'lib/themes/components/tabs';
import inputTheme from 'lib/themes/components/input';
import checkboxTheme from 'lib/themes/components/checkbox';
import buttonTheme from 'lib/themes/components/button';
import tooltipTheme from 'lib/themes/components/tooltip';
import numberInputTheme from 'lib/themes/components/numberInput';
import switchTheme from 'lib/themes/components/switch';
import progressTheme from 'lib/themes/components/progress';
import {inconsolata, montserrat} from 'lib/themes/fonts';


// TODO: extend base theme instead of full theme
export default extendTheme({
  colors: {
    arctic: {
      50: '#e3f5fe',
      100: '#cbdbe7',
      200: '#adc1d0',
      300: '#90a8bb',
      400: '#7290a7',
      500: '#58768d',
      600: '#445c6f',
      700: '#2e4251',
      800: '#182833',
      900: '#131a22'
    },
    gray: {
      50: '#f8f0f2',
      100: '#d9d9d9',
      200: '#bfbfbf',
      300: '#a6a6a6',
      400: '#8c8c8c',
      500: '#737373',
      600: '#363636',
      700: '#303030',
      800: '#242424',
      900: '#181818'
    }
  },
  components: {
    Button: buttonTheme,
    Checkbox: checkboxTheme,
    Input: inputTheme,
    Menu: menuTheme,
    NumberInput: numberInputTheme,
    Progress: progressTheme,
    Switch: switchTheme,
    Tabs: tabsTheme,
    Tooltip: tooltipTheme
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  fonts: {
    heading: montserrat,
    body: montserrat,
    mono: inconsolata
  },
  styles: {
    global: {
      '::-ms-reveal': {
        display: 'none'
      },
      '::selection': {
        bg: 'arctic.600'
      },
      'html, body': {
        bg: 'gray.900',
        lineHeight: 'tall'
      }
    }
  }
} as Partial<ChakraTheme>);
