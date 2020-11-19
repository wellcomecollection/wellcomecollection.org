import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga';
import Raven from 'raven-js';
import { ReactElement, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../../views/themes/default';
import OutboundLinkTracker from '../../views/components/OutboundLinkTracker/OutboundLinkTracker';
import LoadingIndicator from '../../views/components/LoadingIndicator/LoadingIndicator';
import { trackEvent } from '../../utils/ga';
import { AppContextProvider } from '../components/AppContext/AppContext';

declare global {
  interface Window {
    prismic: any;
  }
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

function WecoApp({ Component, pageProps }: AppProps): ReactElement {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      console.info('pageview start', pageProps.pageview);
    };
    const handleRouteChangeComplete = (url: string) => {
      console.info('pageview end', pageProps.pageview);
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);

  // enhanced
  useEffect(() => {
    // JS hook
    document.documentElement.classList.add('enhanced');

    // Making sure the page is tall enough
    const pageHeightCache: number[] = [];
    const html = document.querySelector('html');

    const handleRouteChangeStart = () => {
      document &&
        document.documentElement &&
        pageHeightCache.push(document.documentElement.offsetHeight);
    };

    const handleRouteChangeComplete = () => {
      if (html) {
        html.style.height = 'initial';
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    router.beforePopState(() => {
      if (html) {
        html.style.height = `${pageHeightCache.pop()}px`;
      }

      return true;
    });

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
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
    function trackPageview() {
      ReactGA.pageview(`${window.location.pathname}${window.location.search}`);
    }
    ReactGA.initialize([
      {
        trackingId: 'UA-55614-6',
        titleCase: false,
      },
    ]);
    // TODO: Add this back
    // ReactGA.set({ dimension5: JSON.stringify(toggles) });
    trackPageview();
    router.events.on('routeChangeComplete', trackPageview);
    return () => {
      router.events.off('routeChangeComplete', trackPageview);
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

    router.events.on('routeChangeStart', trackAndResetVisibleTime);
    router.events.on('routeChangeComplete', resetEngagementTimeout);

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
      router.events.off('routeChangeStart', trackAndResetVisibleTime);
      router.events.off('routeChangeComplete', resetEngagementTimeout);
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

  // fonts
  useEffect(() => {
    // This needs to be dynamically required as it's only on the client-side
    /* eslint-disable @typescript-eslint/no-var-requires */
    const FontFaceObserver = require('fontfaceobserver');
    /* eslint-enable @typescript-eslint/no-var-requires */

    const WB = new FontFaceObserver('Wellcome Bold Web', { weight: 'bold' });
    const HNL = new FontFaceObserver('Helvetica Neue Light Web');
    const HNM = new FontFaceObserver('Helvetica Neue Medium Web');
    const LR = new FontFaceObserver('Lettera Regular Web');

    Promise.all([WB.load(), HNL.load(), HNM.load(), LR.load()])
      .then(() => {
        if (document.documentElement) {
          document.documentElement.classList.add('fonts-loaded');
        }
      })
      .catch(console.log);
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
      (function() {
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
          validationFails.forEach(function(validationFail) {
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

  // sentry
  useEffect(() => {
    Raven.config('https://f756b8d4b492473782987a054aa9a347@sentry.io/133634', {
      shouldSendCallback() {
        const oldSafari = /^.*Version\/[0-8].*Safari.*$/;
        const bingPreview = /^.*BingPreview.*$/;

        return ![oldSafari, bingPreview].some(r =>
          r.test(window.navigator.userAgent)
        );
      },
      whitelistUrls: [/wellcomecollection\.org/],
      ignoreErrors: [
        /Blocked a frame with origin/,
        /document\.getElementsByClassName\.ToString/, // https://github.com/SamsungInternet/support/issues/56
      ],
    }).install();
  }, []);

  return (
    <>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <OutboundLinkTracker>
            <LoadingIndicator />
            <Component {...pageProps} />
          </OutboundLinkTracker>
        </ThemeProvider>
      </AppContextProvider>
    </>
  );
}

export default WecoApp;
