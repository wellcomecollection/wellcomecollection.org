import { AppProps } from 'next/app';
import Router from 'next/router';
import ReactGA from 'react-ga';
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

function makeSurePageIsTallEnough() {
  const pageHeightCache: number[] = [];
  const html = document.querySelector('html');

  Router.events.on('routeChangeStart', () => {
    document &&
      document.documentElement &&
      pageHeightCache.push(document.documentElement.offsetHeight);
  });

  Router.events.on('routeChangeComplete', () => {
    if (html) {
      html.style.height = 'initial';
    }
  });

  Router.beforePopState(() => {
    if (html) {
      html.style.height = `${pageHeightCache.pop()}px`;
    }

    return true;
  });
}

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

  // enhanced
  useEffect(() => {
    makeSurePageIsTallEnough();
    document.documentElement.classList.add('enhanced');
  }, []);

  const cookieFlags = 'SameSite=None;secure';
  // GA v4
  useEffect(() => {
    window.gtag &&
      window.gtag('config', 'G-206J7SLYFC', {
        page_path: `${window.location.pathname}${window.location.search}`,
        cookie_flags: cookieFlags,
      });
  }, []);

  // GA v3
  useEffect(() => {
    function trackGaPageview() {
      ReactGA.pageview(`${window.location.pathname}${window.location.search}`);
    }
    ReactGA.initialize([
      {
        trackingId: 'UA-55614-6',
        titleCase: false,
        gaOptions: {
          cookieFlags: cookieFlags,
        },
      },
    ]);

    // This allows us to send a gaDimensions prop from a data fetching method
    // e.g. `getServerSideProps` and store it in the page views.
    // TODO: Probably best moving this into the PageLayout so it's called explicitly.
    if (pageProps.gaDimensions) {
      const {
        gaDimensions: { partOf },
      } = pageProps as WithGaDimensions;

      partOf &&
        partOf.length > 0 &&
        ReactGA.set({
          [gaDimensionKeys.partOf]: partOf.join(','),
        });
    }

    ReactGA.set({
      dimension5: JSON.stringify(serverData.toggles),
    });
    trackGaPageview();
    Router.events.on('routeChangeComplete', trackGaPageview);

    return () => {
      Router.events.off('routeChangeComplete', trackGaPageview);
    };
  }, []);

  usePrismicPreview(Boolean(document.cookie.match('isPreview=true')));

  // We use this method as suggested to optimise the client/server bundles
  // https://github.com/vercel/next.js/issues/5354#issuecomment-520305040
  const isServer = typeof window === 'undefined';
  const isClient = !isServer;

  if (isClient) {
    const { pageview } = pageProps as { pageview: Pageview };
    if (pageview) {
      trackPageview(pageview.name, pageview.properties);
    }
  }

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
