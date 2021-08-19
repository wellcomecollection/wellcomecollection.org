import { AppProps } from 'next/app';
import Router from 'next/router';
import ReactGA from 'react-ga';
import React, { useEffect, FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../views/themes/default';
import OutboundLinkTracker from '../../views/components/OutboundLinkTracker/OutboundLinkTracker';
import LoadingIndicator from '../../views/components/LoadingIndicator/LoadingIndicator';
import { trackEvent } from '../../utils/ga';
import { AppContextProvider } from '../components/AppContext/AppContext';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import {
  getGlobalContextData,
  GlobalContextData,
  WithGlobalContextData,
} from '../components/GlobalContextProvider/GlobalContextProvider';
import { GetServerSidePropsContext } from 'next';
import { trackPageview } from '../../services/conversion/track';
import useIsFontsLoaded from '../../hooks/useIsFontsLoaded';

declare global {
  interface Window {
    prismic: any;
  }
}

export type AppErrorProps = {
  err: {
    statusCode: number;
    message: string;
  };
  globalContextData: GlobalContextData;
};

type Pageview = {
  name: string;
  properties: Record<string, unknown>;
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

export function appError(
  context: GetServerSidePropsContext,
  statusCode: number,
  message: string
): { props: AppErrorProps } {
  const globalContextData = getGlobalContextData(context);
  context.res.statusCode = statusCode;
  return {
    props: {
      err: {
        statusCode,
        message,
      },
      globalContextData,
    },
  };
}

let engagement;
let previouslyAccruedTimeOnSpaPage = 0;
let accruedHiddenTimeOnPage = 0;
let pageVisibilityLastChanged = 0;

function triggerEngagement() {
  ReactGA.event({
    category: 'Engagement',
    action: 'Time on page >=',
    label: '10 seconds',
  });
}

function trackVisibleTimeOnPage() {
  const accruedVisibleTimeOnPage = Math.round(
    window.performance.now() -
      previouslyAccruedTimeOnSpaPage -
      accruedHiddenTimeOnPage
  );
  trackEvent({
    category: 'Engagement',
    action: 'time page is visible',
    value: accruedVisibleTimeOnPage,
    nonInteraction: true,
    transport: 'beacon',
  });
}

function calculateHiddenTimeOnPage() {
  if (!document.hidden) {
    accruedHiddenTimeOnPage = accruedHiddenTimeOnPage +=
      window.performance.now() - pageVisibilityLastChanged;
  }
  pageVisibilityLastChanged = window.performance.now();
}

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

export type WecoAppProps = AppProps & WithGlobalContextData;

const WecoApp: FunctionComponent<WecoAppProps> = ({
  Component,
  pageProps,
  globalContextData,
}) => {
  // enhanced
  useEffect(() => {
    makeSurePageIsTallEnough();
    document.documentElement.classList.add('enhanced');
  }, []);

  // GA v4
  useEffect(() => {
    window.gtag &&
      window.gtag('config', 'G-206J7SLYFC', {
        page_path: `${window.location.pathname}${window.location.search}`,
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
      dimension5: JSON.stringify(globalContextData.toggles),
    });
    trackGaPageview();
    Router.events.on('routeChangeComplete', trackGaPageview);
    return () => {
      Router.events.off('routeChangeComplete', trackGaPageview);
    };
  }, []);

  // Time on page
  useEffect(() => {
    function trackAndResetVisibleTime() {
      trackVisibleTimeOnPage();
      previouslyAccruedTimeOnSpaPage = window.performance.now();
      pageVisibilityLastChanged = 0;
      accruedHiddenTimeOnPage = 0;
    }

    function resetEngagementTimeout() {
      clearTimeout(engagement);
      engagement = setTimeout(triggerEngagement, 10000);
    }

    Router.events.on('routeChangeStart', trackAndResetVisibleTime);
    Router.events.on('routeChangeComplete', resetEngagementTimeout);

    engagement = setTimeout(triggerEngagement, 10000);
    try {
      if (document.hidden) {
        // in case page is opened in a new tab
        pageVisibilityLastChanged = window.performance.now();
      }
      document.addEventListener('visibilitychange', calculateHiddenTimeOnPage);
      window.addEventListener('beforeunload', trackVisibleTimeOnPage);
    } catch (error) {
      trackEvent({
        category: 'Engagement',
        action: 'unable to track time page is visible',
        nonInteraction: true,
      });
    }

    return () => {
      Router.events.off('routeChangeStart', trackAndResetVisibleTime);
      Router.events.off('routeChangeComplete', resetEngagementTimeout);
      try {
        document.removeEventListener(
          'visibilitychange',
          calculateHiddenTimeOnPage
        );
        window.removeEventListener('beforeunload', trackVisibleTimeOnPage);
      } catch (error) {}
    };
  }, []);

  // lazysizes
  useEffect(() => {
    // This needs to be dynamically required as it's only on the client-side
    /* eslint-disable @typescript-eslint/no-var-requires */
    const lazysizes = require('lazysizes');
    /* eslint-enable @typescript-eslint/no-var-requires */
    lazysizes.init();
  }, []);

  // prismic warnings
  // TODO: This should be componentized
  useEffect(() => {
    // Prismic preview and validation warnings
    if (document.cookie.match('isPreview=true')) {
      window.prismic = {
        endpoint: 'https://wellcomecollection.prismic.io/api/v2',
      };
      const prismicScript = document.createElement('script');
      prismicScript.src = '//static.cdn.prismic.io/prismic.min.js';
      document.head && document.head.appendChild(prismicScript);
      (function () {
        const validationBar = document.createElement('div');
        validationBar.style.position = 'fixed';
        validationBar.style.width = '375px';
        validationBar.style.padding = '15px';
        validationBar.style.background = '#e01b2f';
        validationBar.style.color = '#ffffff';
        validationBar.style.bottom = '0';
        validationBar.style.right = '0';
        validationBar.style.fontSize = '12px';
        validationBar.style.zIndex = '2147483000';

        const validationFails: string[] = [];

        const descriptionEl = document.querySelector(
          'meta[name="description"]'
        );
        if (descriptionEl && !descriptionEl.getAttribute('content')) {
          validationFails.push(`
            <b>Warning:</b>
            This piece of content is missing its description.
            This helps with search engine results and sharing on social channels.
            (If this is from Prismic, it's the promo text).
          `);
        }

        const imageEl = document.querySelector('meta[property="og:image"]');
        if (imageEl && !imageEl.getAttribute('content')) {
          validationFails.push(`
            <b>Warning:</b>
            This piece of content is missing its promo image.
            This is the image that will be shown across our site,
            as well as on social media.
          `);
        }

        if (validationFails.length > 0) {
          validationFails.forEach(function (validationFail) {
            const div = document.createElement('div');
            div.style.marginBottom = '6px';
            div.innerHTML = validationFail;
            validationBar.appendChild(div);
          });
          document.body && document.body.appendChild(validationBar);
        }
      })();
    }
  }, []);

  // sentry pageview
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
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle
            toggles={globalContextData.toggles}
            isFontsLoaded={useIsFontsLoaded()}
          />
          <OutboundLinkTracker>
            <LoadingIndicator />
            {!pageProps.err && <Component {...pageProps} />}
            {pageProps.err && (
              <ErrorPage
                statusCode={pageProps.err.statusCode}
                title={pageProps.err.message}
                globalContextData={globalContextData}
              />
            )}
          </OutboundLinkTracker>
        </ThemeProvider>
      </AppContextProvider>
    </>
  );
};

export default WecoApp;
