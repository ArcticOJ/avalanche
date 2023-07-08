import {ChakraBaseProvider, ToastProvider, useConst} from '@chakra-ui/react';
import theme from 'lib/themes/app';
import React, {Suspense} from 'react';
import {ensureClientSide} from 'lib/utils/common';
import {TranslationProvider} from 'lib/hooks/usei18n';
import {AuthProvider} from 'lib/hooks/useAuth';
import 'styles/arctic.scss';
import 'lib/loaders/dayjs';
import Layout from 'components/Layout';
import type {AppProps} from 'next/app';
import LoadingOverlay from 'components/LoadingOverlay';
import {CacheProvider} from '@chakra-ui/next-js';
import NoSSR from 'react-no-ssr';

export default function App({Component, pageProps}: AppProps) {
  const defaultLanguage = useConst(ensureClientSide(() => /^vi\b/i.test(navigator.language) ? 'vi' : 'en'));
  return (
    <NoSSR>
      <TranslationProvider defaultLanguage={defaultLanguage}>
        <AuthProvider>
          <CacheProvider>
            <ChakraBaseProvider theme={theme}>
              {/*<ErrorBoundary fallback='Error occurred during render.'>*/}
              <ToastProvider />
              <Suspense fallback={<LoadingOverlay fill />}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Suspense>
              {/*</ErrorBoundary>*/}
            </ChakraBaseProvider>
          </CacheProvider>
        </AuthProvider>
      </TranslationProvider>
    </NoSSR>
  );
}
