// @flow
import type {AppInitialProps} from 'next/app';
import App, { Container } from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import ReactGA from 'react-ga';
import Raven from 'raven-js';
import {Fragment} from 'react';
import {ThemeProvider} from 'styled-components';
import theme from '../../views/themes/default';
import {parseOpeningTimesFromCollectionVenues} from '../../services/prismic/opening-times';
import ErrorPage from '../../views/components/ErrorPage/ErrorPage';
import TogglesContext from '../../views/components/TogglesContext/TogglesContext';
import OpeningTimesContext from '../../views/components/OpeningTimesContext/OpeningTimesContext';
import GlobalAlertContext from '../../views/components/GlobalAlertContext/GlobalAlertContext';

const isServer = typeof window === 'undefined';
const isClient = !isServer;

let toggles;
let openingTimes;
let globalAlert;
let engagement;
let previousTimeOnPage = 0;
let pageHiddenTime = 0;
let pageVisibilityLastChanged = 0;

// tidy up
function sendPageTimeMetrics(visibleTime, hiddenTime) {
  const isNonInteraction = ;


}

function triggerEngagement() {
  ReactGA.event({
    category: 'Engagement',
    action: 'Time on page >=',
    label: '10 seconds'
  });
}

function trackVisibleTimeOnPage () {
  const visibleTime = window.performance.now() - previousTimeOnPage - pageHiddenTime; // TODO round
  ReactGA.ga('send', { // use .event?
    hitType: 'event',
    eventCategory: 'Engagement',
    eventAction: 'Time page is visible'
    eventValue: visibleTime
    nonInteraction: Boolean(visibleTime < 10000),
    transport: 'beacon'
    // 'metricX': ??? // TODO possibly send to a custom metric
  });
  // e.returnValue = 'prevent browser closing'; // TODO just for testing
}

function trackRouteChange() {
  ReactGA.pageview(
    `${window.location.pathname}${window.location.search}`
  );
  clearTimeout(engagement);
  engagement = setTimeout(triggerEngagement, 10000);
  trackVisibleTimeOnPage();
  previousTimeOnPage = window.performance.now();
  pageVisibilityLastChanged = 0;
  pageHiddenTime = 0;
}

function trackHiddenTimeOnPage () {
  if (!document.hidden) {
    pageHiddenTime = pageHiddenTime += (window.performance.now() - pageVisibilityLastChanged);
  }
  pageVisibilityLastChanged = window.performance.now();
}

export default class WecoApp extends App {
  static async getInitialProps({ Component, router, ctx }: AppInitialProps) {
    // Caching things from the server request to be available to the client
    toggles = isServer ? router.query.toggles : toggles;
    openingTimes = isServer ? router.query.openingTimes : openingTimes;
    globalAlert = isServer ? router.query.globalAlert : globalAlert;

    let pageProps = {};
    if (Component.getInitialProps) {
      ctx.query.toggles = toggles;
      pageProps = await Component.getInitialProps(ctx);

      // If we override the statusCode from getInitialProps, make sure we
      // set that on the server response too
      if (ctx.res && pageProps.statusCode) {
        ctx.res.statusCode = pageProps.statusCode;
      }
    }

    return {
      pageProps,
      toggles,
      openingTimes,
      globalAlert
    };
  }

  // TODO: (flowtype) 😡
  constructor(props: any) {
    if (isClient && !toggles) { toggles = props.toggles; }
    if (isClient && !openingTimes) { openingTimes = props.openingTimes; }
    if (isClient && !globalAlert) { globalAlert = props.globalAlert; }
    super(props);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart',  trackRouteChange);
  }

  componentDidMount() {
    if (document.documentElement) {
      document.documentElement.classList.add('enhanced');
    }

    ReactGA.initialize([{
      trackingId: 'UA-55614-6',
      titleCase: false
    }]);

    try {
      if (document.hidden) {
        pageVisibilityLastChanged = window.performance.now(); // in case page is opened in a new tab
      }
      document.addEventListener('visibilitychange', trackHiddenTimeOnPage, false);
      window.addEventListener('beforeunload', function(e) {
        trackVisibleTimeOnPage(e);
      });
    } catch (error) {
      console.log(error);
    }

    try {
      ReactGA.set({'dimension5': JSON.stringify(toggles)});
    } catch (error) {
      // don't do anything
    }

    ReactGA.pageview(`${window.location.pathname}${window.location.search}`);

    engagement = setTimeout(triggerEngagement, 10000);
    Router.events.on('routeChangeStart', trackRouteChange);

    // TODO: Is there a better implementation of this
    const lazysizes = require('lazysizes');
    lazysizes.init();

    // Fonts
    const FontFaceObserver = require('fontfaceobserver');

    const WB = new FontFaceObserver('Wellcome Bold Web', {weight: 'bold'});
    const HNL = new FontFaceObserver('Helvetica Neue Light Web');
    const HNM = new FontFaceObserver('Helvetica Neue Medium Web');
    const LR = new FontFaceObserver('Lettera Regular Web');

    Promise.all([WB.load(), HNL.load(), HNM.load(), LR.load()]).then(() => {
      if (document.documentElement) {
        document.documentElement.classList.add('fonts-loaded');
      }
    }).catch(console.log);

    // Hotjar
    (function(h, o, t, j, a, r) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = {hjid: 3858, hjsv: 5};
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');

    // Prismic preview and validation warnings
    const isPreview = document.cookie.match('isPreview=true');
    if (isPreview) {
      window.prismic = {
        endpoint: 'https://wellcomecollection.prismic.io/api/v2'
      };
      const prismicScript = document.createElement('script');
      prismicScript.src = '//static.cdn.prismic.io/prismic.min.js';
      document.head && document.head.appendChild(prismicScript);
      (function () {
        var validationBar = document.createElement('div');
        validationBar.style.position = 'fixed';
        validationBar.style.width = '375px';
        validationBar.style.padding = '15px';
        validationBar.style.background = '#e01b2f';
        validationBar.style.color = '#ffffff';
        validationBar.style.bottom = '0';
        validationBar.style.right = '0';
        validationBar.style.fontSize = '12px';
        validationBar.style.zIndex = '2147483000';

        var validationFails = [];

        var descriptionEl = document.querySelector('meta[name="description"]');
        if (descriptionEl && !descriptionEl.getAttribute('content')) {
          validationFails.push(`
            <b>Warning:</b>
            This piece of content is missing its description.
            This helps with search engine results and sharing on social channels.
            (If this is from Prismic, it's the promo text).
          `);
        }

        var imageEl = document.querySelector('meta[property="og:image"]');
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
            var div = document.createElement('div');
            div.style.marginBottom = '6px';
            div.innerHTML = validationFail;
            validationBar.appendChild(div);
          });
          document.body && document.body.appendChild(validationBar);
        }
      })();
    }

    // Raven
    Raven.config('https://f756b8d4b492473782987a054aa9a347@sentry.io/133634', {
      shouldSendCallback(data) {
        const oldSafari = /^.*Version\/[0-8].*Safari.*$/;
        const bingPreview = /^.*BingPreview.*$/;

        return ![oldSafari, bingPreview].some(r => r.test(window.navigator.userAgent));
      },
      whitelistUrls: [/wellcomecollection\.org/],
      ignoreErrors: [
        /Blocked a frame with origin/,
        /document\.getElementsByClassName\.ToString/ // https://github.com/SamsungInternet/support/issues/56
      ]
    }).install();
  }

  componentDidCatch(error: Error, errorInfo: {componentStack: string}) {
    Raven.captureException(error, { extra: errorInfo });
    super.componentDidCatch(error, errorInfo);
  }

  render () {
    const {
      Component,
      pageProps,
      toggles,
      openingTimes,
      globalAlert
    } = this.props;
    const polyfillFeatures = [
      'default',
      'Array.prototype.find',
      'Array.prototype.includes',
      'WeakMap',
      'URL'
    ];
    const parsedOpeningTimes = parseOpeningTimesFromCollectionVenues(openingTimes);

    return (
      <Container>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
          <script src={`https://cdn.polyfill.io/v3/polyfill.js?features=${polyfillFeatures.join(',')}`}></script>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='apple-touch-icon' sizes='180x180' href='https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png' />
          <link rel='shortcut icon' href='https://i.wellcomecollection.org/assets/icons/favicon.ico' type='image/ico' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-32x32.png' sizes='32x32' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-16x16.png' sizes='16x16' />
          <link rel='manifest' href='https://i.wellcomecollection.org/assets/icons/manifest.json' />
          <link rel='mask-icon' href='https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg' color='#000000' />
          <script src='https://i.wellcomecollection.org/assets/libs/picturefill.min.js' async />
        </Head>
        <TogglesContext.Provider value={toggles}>
          <OpeningTimesContext.Provider value={parsedOpeningTimes}>
            <GlobalAlertContext.Provider value={globalAlert.text}>
              <ThemeProvider theme={theme}>
                <Fragment>
                  {!pageProps.statusCode && <Component {...pageProps} />}
                  {pageProps.statusCode && pageProps.statusCode !== 200 && <ErrorPage statusCode={pageProps.statusCode} />}
                </Fragment>
              </ThemeProvider>
            </GlobalAlertContext.Provider>
          </OpeningTimesContext.Provider>
        </TogglesContext.Provider>
      </Container>
    );
  }
}
