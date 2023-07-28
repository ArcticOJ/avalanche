import {ChakraBaseProvider, ToastProvider, useConst} from '@chakra-ui/react';
import theme from 'lib/themes/app';
import React, {Suspense, useMemo} from 'react';
import {ensureClientSide} from 'lib/utils/common';
import {TranslationProvider, usei18n} from 'lib/hooks/usei18n';
import {AuthProvider} from 'lib/hooks/useAuth';
import 'styles/arctic.scss';
import 'lib/loaders/dayjs';
import Layout from 'components/Layout';
import type {AppProps} from 'next/app';
import LoadingOverlay from 'components/LoadingOverlay';
import NoSSR from 'react-no-ssr';
import Head from 'next/head';
import {brandName} from 'lib/branding';
import ErrorBoundary from 'components/ErrorBoundary';

function Title({component}) {
  const {t, currentLanguage} = usei18n();
  const pageTitle = useMemo(() => component.displayName ? `${brandName} | ${t(`routes.${component.displayName}`)}` : brandName, [component, currentLanguage]);
  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}

export default function App({Component, pageProps}: AppProps) {
  const defaultLanguage = useConst(ensureClientSide(() => /^vi\b/i.test(navigator.language) ? 'vi' : 'en'));
  return (
    <NoSSR>
      <TranslationProvider defaultLanguage={defaultLanguage}>
        <AuthProvider>
          <Title component={Component} />
          <ChakraBaseProvider theme={theme}>
            <ErrorBoundary fallback='Error occurred during render.'>
              <ToastProvider />
              <Suspense fallback={<LoadingOverlay fill />}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Suspense>
            </ErrorBoundary>
          </ChakraBaseProvider>
        </AuthProvider>
      </TranslationProvider>
    </NoSSR>
  );
}
