import {ColorModeScript, theme} from '@chakra-ui/react';
import {Head, Html, Main, NextScript} from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' type='image/png' href='/static/favicon.png' />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} storageKey='arctic:color-mode' />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
