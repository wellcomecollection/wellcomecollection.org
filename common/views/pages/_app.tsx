import { AppProps } from 'next/app';
import React, { useEffect, FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../views/themes/default';
import newTheme from '../themes/newThemeDefault';
import OutboundLinkTracker from '../../views/components/OutboundLinkTracker/OutboundLinkTracker';
import LoadingIndicator from '../../views/components/LoadingIndicator/LoadingIndicator';
import { AppContextProvider } from '../components/AppContext/AppContext';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import { trackPageview } from '../../services/conversion/track';
import useIsFontsLoaded from '../../hooks/useIsFontsLoaded';
import { isServerData, defaultServerData } from '../../server-data/types';
import { ServerDataContext } from '../../server-data/Context';
import UserProvider from '../components/UserProvider/UserProvider';
import { ApmContextProvider } from '../components/ApmContext/ApmContext';
import usePrismicPreview from '../../services/app/usePrismicPreview';
import useMaintainPageHeight from '../../services/app/useMaintainPageHeight';
import {
  useGoogleAnalyticsUA,
  useGoogleAnalyticsV4,
} from '../../services/app/analytics';
import { useOnPageLoad } from '../../services/app/useOnPageLoad';
import ReactGA from 'react-ga';

type Pageview = {
  name: string;
  properties: Record<string, string[] | number[] | string | number | undefined>;
};

export type WithPageview = {
  pageview: Pageview;
};

type GaDimensions = {
  partOf: string[];
};

export type WithGaDimensions = {
  gaDimensions: GaDimensions;
};

const gaDimensionKeys = {
  partOf: 'dimension3',
};

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

const WecoApp: FunctionComponent<AppProps> = ({
  Component,
  pageProps,
  router,
}) => {
  // You can set `skipServerData: true` to explicitly bypass this
  // e.g. for error pages
  const isServerDataSet = isServerData(pageProps.serverData);

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
  useEffect(() => {
    document.documentElement.classList.add('enhanced');
  }, []);

  useGoogleAnalyticsV4();
  useGoogleAnalyticsUA({
    toggles: serverData.toggles,
    gaDimensions: pageProps.gaDimensions,
  });

  useOnPageLoad(url => ReactGA.pageview(url));
  useOnPageLoad(() => {
    const { pageview } = pageProps as { pageview: Pageview };
    if (pageview) {
      trackPageview(pageview.name, pageview.properties);
    }
  });

  usePrismicPreview(Boolean(document.cookie.match('isPreview=true')));

  return (
    <>
      <ApmContextProvider>
        <ServerDataContext.Provider value={serverData}>
          <UserProvider>
            <AppContextProvider>
              <ThemeProvider
                theme={serverData.toggles.newPalette ? newTheme : theme}
              >
                <GlobalStyle
                  toggles={serverData.toggles}
                  isFontsLoaded={useIsFontsLoaded()}
                />
                <OutboundLinkTracker>
                  <LoadingIndicator />
                  {!pageProps.err && <Component {...pageProps} />}
                  {pageProps.err && (
                    <ErrorPage
                      statusCode={pageProps.err.statusCode}
                      title={pageProps.err.message}
                    />
                  )}
                </OutboundLinkTracker>
              </ThemeProvider>
            </AppContextProvider>
          </UserProvider>
        </ServerDataContext.Provider>
      </ApmContextProvider>
    </>
  );
};

export default WecoApp;
