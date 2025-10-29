import { GetServerSideProps, NextPage } from 'next';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { ApmContextProvider } from '@weco/common/contexts/ApmContext';
import { AppContextProvider } from '@weco/common/contexts/AppContext';
import { SearchContextProvider } from '@weco/common/contexts/SearchContext';
import { UserContextProvider } from '@weco/common/contexts/UserContext';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';
import { useScrollTracking } from '@weco/common/hooks/useScrollTracking';
import { ServerDataContext } from '@weco/common/server-data/Context';
import {
  defaultServerData,
  isServerData,
  ServerData,
  SimplifiedServerData,
} from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import useMaintainPageHeight from '@weco/common/services/app/useMaintainPageHeight';
import usePrismicPreview from '@weco/common/services/app/usePrismicPreview';
import { deserialiseProps } from '@weco/common/utils/json';
import CivicUK from '@weco/common/views/components/CivicUK';
import GlobalSvgDefinitions from '@weco/common/views/components/GlobalSvgDefinitions';
import LoadingIndicator from '@weco/common/views/components/LoadingIndicator';
import ErrorPage from '@weco/common/views/layouts/ErrorPage';
import theme, { GlobalStyle } from '@weco/common/views/themes/default';

// Error pages can't send anything via the data fetching methods as
// the page needs to be rendered as soon as the error happens.
// We just use the route to determine if this is an error page to ignore
// serverData not being set
// see: https://github.com/vercel/next.js/discussions/11945#discussioncomment-6790
function isErrorPage(route: string): boolean {
  switch (route) {
    case '/404':
    case '/500':
    case '/_error':
      return true;
    default:
      return false;
  }
}

const dev = process.env.NODE_ENV !== 'production';
const civicUkApiKey = process.env.NEXT_PUBLIC_CIVICUK_API_KEY;

type GlobalProps = {
  serverData: ServerData;
} & Partial<AppErrorProps>;

type WecoAppProps = Omit<AppProps, 'pageProps'> & {
  pageProps: GlobalProps;
};

// ServerSideProps is a generic type for props returned from getServerSideProps.
// - If T is an empty object type ({}), it produces a type with only serverData and optional pageview.
// - If T is any other type, it merges T with serverData and optional pageview.
// - The NotAny utility ensures T cannot be 'any', for stricter type safety.
type NotAny<T> = 0 extends 1 & T ? never : T;
export type ServerSideProps<T = NonNullable<unknown>> = [T] extends [
  Record<string, never>,
]
  ? {
      serverData: SimplifiedServerData;
    }
  : NotAny<T> & {
      serverData: SimplifiedServerData;
    };

export type ServerSidePropsOrAppError<T extends ServerSideProps<unknown>> =
  GetServerSideProps<T | AppErrorProps>;

const WecoApp: NextPage<WecoAppProps> = ({ pageProps, router, Component }) => {
  // You can set `skipServerData: true` to explicitly bypass this
  // e.g. for error pages
  const isServerDataSet = isServerData(pageProps.serverData);

  useScrollTracking();

  // We allow error pages through as they don't need, and can't set
  // serverData as they don't have data fetching methods.exi
  if (
    dev &&
    !isServerDataSet &&
    !isErrorPage(router.route) &&
    !('err' in pageProps)
  ) {
    throw new Error(
      'Please set serverData on your getServerSideProps or getStaticProps'
    );
  }

  const serverData = isServerDataSet ? pageProps.serverData : defaultServerData;

  useMaintainPageHeight();

  type ConsentType = 'granted' | 'denied';
  const onConsentChanged = (
    event: CustomEvent<{
      analyticsConsent?: ConsentType;
      marketingConsent?: ConsentType;
    }>
  ) => {
    // Update datalayer config with consent value
    gtag('consent', 'update', {
      ...(event.detail.analyticsConsent && {
        analytics_storage: event.detail.analyticsConsent,
      }),
      ...(event.detail.marketingConsent && {
        ad_storage: event.detail.marketingConsent,
        ad_personalization: event.detail.marketingConsent,
        ad_user_data: event.detail.marketingConsent,
      }),
    });
  };

  useEffect(() => {
    document.documentElement.classList.add('enhanced');

    window.addEventListener('consentChanged', onConsentChanged);

    return () => {
      window.removeEventListener('consentChanged', onConsentChanged);
    };
  }, []);

  // GTM can't seem to handle pageview events when we use NextLink,
  // so we push a custom event to the dataLayer and that instead
  useEffect(() => {
    window.dataLayer?.push({
      event: 'custom_pageview',
    });
  }, [router.pathname]);

  usePrismicPreview(() => Boolean(document.cookie.match('isPreview=true')));

  const isCookieBannerException = () => {
    // Banner shouldn't appear in Prismic's Slice Simulator (or Page Builder)
    if (router.route === '/slice-simulator') return true;

    return false;
  };

  const displayCookieBanner = civicUkApiKey && !isCookieBannerException();

  return (
    <>
      <ApmContextProvider>
        <ServerDataContext.Provider value={serverData}>
          <UserContextProvider>
            <AppContextProvider>
              <SearchContextProvider>
                <ThemeProvider theme={theme}>
                  <GlobalStyle
                    toggles={serverData.toggles}
                    isFontsLoaded={useIsFontsLoaded()}
                  />

                  <GlobalSvgDefinitions />
                  <LoadingIndicator />

                  {displayCookieBanner && <CivicUK apiKey={civicUkApiKey} />}

                  {!pageProps.err && (
                    <Component {...deserialiseProps(pageProps)} />
                  )}
                  {pageProps.err && (
                    <ErrorPage
                      statusCode={pageProps.err.statusCode}
                      title={pageProps.err.message}
                    />
                  )}
                </ThemeProvider>
              </SearchContextProvider>
            </AppContextProvider>
          </UserContextProvider>
        </ServerDataContext.Provider>
      </ApmContextProvider>
    </>
  );
};

export default WecoApp;
