import {ColorModeScript} from '@chakra-ui/react';
import theme from 'lib/themes/app';
import Document, {Head, Html, Main, NextScript} from 'next/document';

export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='icon' type='image/png' href='/static/favicon.png' />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
