import {AppProps} from 'next/app';
import Layout from 'components/Layout';
import 'styles/arctic.css';
import Head from 'next/head';
import {ChakraProvider, ToastProvider} from '@chakra-ui/react';
import {Component, useMemo} from 'react';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import theme from 'lib/themes/app';
import {AuthProvider} from 'lib/hooks/useAuth';
import {TranslationProvider, usei18n} from 'lib/hooks/usei18n';
import {ensureClientSide} from 'lib/utils';

function Title({component}) {
  const {t, currentLanguage} = usei18n();
  const pageTitle = useMemo(() => component.displayName ? `Arctic | ${t(`routes.${component.displayName}`)}` : 'Arctic', [component, currentLanguage]);
  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}

export default function App({Component, pageProps}: AppProps) {
  const defaultLanguage = useMemo(ensureClientSide(() => /^vi\b/i.test(navigator.language) ? 'vi' : 'en'), []);
  return (
    <TranslationProvider defaultLanguage={defaultLanguage}>
      <Title component={Component} />
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastProvider />
        </ChakraProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}
