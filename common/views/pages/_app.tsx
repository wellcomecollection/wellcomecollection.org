import { AppProps } from 'next/app';
import React, { useEffect, FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../views/themes/default';
import newTheme from '../themes/newThemeDefault';
import OutboundLinkTracker from '../../views/components/OutboundLinkTracker/OutboundLinkTracker';
import LoadingIndicator from '../../views/components/LoadingIndicator/LoadingIndicator';
import { AppContextProvider } from '../components/AppContext/AppContext';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import { Pageview, trackPageview } from '../../services/conversion/track';
import useIsFontsLoaded from '../../hooks/useIsFontsLoaded';
import {
  isServerData,
  defaultServerData,
  ServerData,
} from '../../server-data/types';
import { ServerDataContext } from '../../server-data/Context';
import UserProvider from '../components/UserProvider/UserProvider';
import { ApmContextProvider } from '../components/ApmContext/ApmContext';
import usePrismicPreview from '../../services/app/usePrismicPreview';
import useMaintainPageHeight from '../../services/app/useMaintainPageHeight';
import {
  GaDimensions,
  useGoogleAnalyticsUA,
  useGoogleAnalyticsV4,
} from '../../services/app/google-analytics';
import { useOnPageLoad } from '../../services/app/useOnPageLoad';
import ReactGA from 'react-ga';
import { NextPageContext } from 'next';

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

type GlobalProps = {
  serverData: ServerData;
  pageview?: Pageview;
  gaDimensions?: GaDimensions;
  err?: NextPageContext['err'];
};

type WecoAppProps = Omit<AppProps, 'pageProps'> & { pageProps: GlobalProps };

const WecoApp: FunctionComponent<WecoAppProps> = ({
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
    if (pageProps.pageview) {
      trackPageview(pageProps.pageview.name, pageProps.pageview.properties);
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
                  {!pageProps.err && <Component {...(pageProps as any)} />}
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
