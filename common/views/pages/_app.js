// @flow
import type { AppInitialProps } from 'next/app';
import App from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import ReactGA from 'react-ga';
import Raven from 'raven-js';
import { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../../views/themes/default';
import { museumLd, libraryLd, objToJsonLd } from '../../utils/json-ld';
import { wellcomeCollectionGallery } from '../../model/organization';
import { parseCollectionVenues } from '../../services/prismic/opening-times';
import { type OpeningHours } from '../../model/opening-hours';
import ErrorPage from '../../views/components/ErrorPage/ErrorPage';
import TogglesContext from '../../views/components/TogglesContext/TogglesContext';
import OutboundLinkTracker from '../../views/components/OutboundLinkTracker/OutboundLinkTracker';
import OpeningTimesContext from '../../views/components/OpeningTimesContext/OpeningTimesContext';
import LoadingIndicator from '../../views/components/LoadingIndicator/LoadingIndicator';
import GlobalAlertContext from '../../views/components/GlobalAlertContext/GlobalAlertContext';
import JsonLd from '../../views/components/JsonLd/JsonLd';
import { TrackerScript } from '../../views/components/Tracker/Tracker';
import { trackEvent } from '../../utils/ga';
import UtilsContext from '../components/UtilsContext/UtilsContext';

type State = {|
  isKeyboard: boolean,
  isEnhanced: boolean,
  togglesContext: {},
|};

const isServer = typeof window === 'undefined';
const isClient = !isServer;

let toggles;
let openingTimes;
let globalAlert;
let isPreview;
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

function trackRouteChangeStart() {
  trackVisibleTimeOnPage();
  previouslyAccruedTimeOnSpaPage = window.performance.now();
  pageVisibilityLastChanged = 0;
  accruedHiddenTimeOnPage = 0;
}

function trackRouteChangeComplete() {
  clearTimeout(engagement);
  engagement = setTimeout(triggerEngagement, 10000);
  ReactGA.pageview(`${window.location.pathname}${window.location.search}`);
}

function calculateHiddenTimeOnPage() {
  if (!document.hidden) {
    accruedHiddenTimeOnPage = accruedHiddenTimeOnPage +=
      window.performance.now() - pageVisibilityLastChanged;
  }
  pageVisibilityLastChanged = window.performance.now();
}

function openingHoursToOpeningHoursSpecification(openingHours: OpeningHours) {
  return {
    openingHoursSpecification:
      openingHours && openingHours.regular
        ? openingHours.regular.map(openingHoursDay => {
            const specObject = objToJsonLd(
              openingHoursDay,
              'OpeningHoursSpecification',
              false
            );
            delete specObject.note;
            return specObject;
          })
        : [],
    specialOpeningHoursSpecification:
      openingHours &&
      openingHours.exceptional &&
      openingHours.exceptional.map(openingHoursDate => {
        const specObject = {
          opens: openingHoursDate.opens,
          closes: openingHoursDate.closes,
          validFrom: openingHoursDate.overrideDate.format('DD MMMM YYYY'),
          validThrough: openingHoursDate.overrideDate.format('DD MMMM YYYY'),
        };
        return objToJsonLd(specObject, 'OpeningHoursSpecification', false);
      }),
  };
}

function makeSurePageIsTallEnough() {
  const pageHeightCache = [];
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

export default class WecoApp extends App {
  static async getInitialProps({ Component, router, ctx }: AppInitialProps) {
    // Caching things from the server request to be available to the client
    toggles = isServer ? router.query.toggles : toggles;
    openingTimes = isServer ? router.query.openingTimes : openingTimes;
    globalAlert = isServer ? router.query.globalAlert : globalAlert;
    isPreview = isServer ? router.query.isPreview : isPreview;

    let pageProps = {};
    if (Component.getInitialProps) {
      ctx.query.toggles = toggles;
      ctx.query.isPreview = isPreview;

      // If the getInitialProps fails, we should propegate this failure through to the repsonse.
      try {
        pageProps = await Component.getInitialProps(ctx);
      } catch (error) {
        pageProps.statusCode = 500;
        pageProps.error = error;
      }

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
      globalAlert,
      isPreview,
    };
  }

  // TODO: (flowtype) 😡
  constructor(props: any) {
    if (isClient && !toggles) {
      toggles = props.toggles;
    }
    if (isClient && !openingTimes) {
      openingTimes = props.openingTimes;
    }
    if (isClient && !globalAlert) {
      globalAlert = props.globalAlert;
    }
    if (isClient && !isPreview) {
      isPreview = props.isPreview;
    }

    super(props);
  }

  state: State = {
    isKeyboard: true,
    isEnhanced: false,
    togglesContext: toggles,
  };

  updateToggles = (newToggles: Object) => {
    this.setState({ togglesContext: { ...toggles, ...newToggles } });
  };

  setIsKeyboardFalse = () => {
    this.setState({ isKeyboard: false });
  };

  setIsKeyboardTrue = () => {
    this.setState({ isKeyboard: true });
  };

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.setIsKeyboardFalse);
    document.removeEventListener('keydown', this.setIsKeyboardTrue);

    Router.events.off('routeChangeStart', trackRouteChangeStart);
    Router.events.off('routeChangeComplete', trackRouteChangeComplete);
    try {
      document.removeEventListener(
        'visibilitychange',
        calculateHiddenTimeOnPage
      );
      window.removeEventListener('beforeunload', trackVisibleTimeOnPage);
    } catch (error) {
      // nada
    }
  }

  componentDidMount() {
    this.setState({
      togglesContext: toggles,
      isEnhanced: true,
      isKeyboard: false,
    });
    document.addEventListener('mousedown', this.setIsKeyboardFalse);
    document.addEventListener('keydown', this.setIsKeyboardTrue);

    makeSurePageIsTallEnough();

    if (document.documentElement) {
      document.documentElement.classList.add('enhanced');
    }

    ReactGA.initialize([
      {
        trackingId: 'UA-55614-6',
        titleCase: false,
      },
    ]);

    try {
      if (document.hidden) {
        pageVisibilityLastChanged = window.performance.now(); // in case page is opened in a new tab
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

    try {
      ReactGA.set({ dimension5: JSON.stringify(toggles) });
    } catch (error) {
      // don't do anything
    }

    ReactGA.pageview(`${window.location.pathname}${window.location.search}`);
    engagement = setTimeout(triggerEngagement, 10000);
    Router.events.on('routeChangeStart', trackRouteChangeStart);
    Router.events.on('routeChangeComplete', trackRouteChangeComplete);

    // TODO: Is there a better implementation of this
    const lazysizes = require('lazysizes');
    lazysizes.init();

    // Fonts
    const FontFaceObserver = require('fontfaceobserver');

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

    // Hotjar
    (function(h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function() {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: 3858, hjsv: 5 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');

    // Prismic preview and validation warnings
    if (isPreview || document.cookie.match('isPreview=true')) {
      window.prismic = {
        endpoint: 'https://wellcomecollection.prismic.io/api/v2',
      };
      const prismicScript = document.createElement('script');
      prismicScript.src = '//static.cdn.prismic.io/prismic.min.js';
      document.head && document.head.appendChild(prismicScript);
      (function() {
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
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    Raven.captureException(error, { extra: errorInfo });
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { togglesContext, isKeyboard, isEnhanced } = this.state;
    const updateToggles = this.updateToggles;
    const { Component, pageProps, openingTimes, globalAlert } = this.props;
    const polyfillFeatures = [
      'default',
      'Array.prototype.find',
      'Array.prototype.includes',
      'Array.prototype.includes',
      'Object.entries',
      'WeakMap',
      'URL',
    ];
    const parsedOpeningTimes = parseCollectionVenues(openingTimes);
    const galleries = parsedOpeningTimes.collectionOpeningTimes.placesOpeningHours.find(
      venue => venue.name.toLowerCase() === 'galleries'
    );
    const library = parsedOpeningTimes.collectionOpeningTimes.placesOpeningHours.find(
      venue => venue.name.toLowerCase() === 'library'
    );
    const galleriesOpeningHours = galleries && galleries.openingHours;
    const libraryOpeningHours = library && library.openingHours;
    const wellcomeCollectionGalleryWithHours = {
      ...wellcomeCollectionGallery,
      ...openingHoursToOpeningHoursSpecification(galleriesOpeningHours),
    };
    const wellcomeLibraryWithHours = {
      ...wellcomeCollectionGallery,
      ...openingHoursToOpeningHoursSpecification(libraryOpeningHours),
    };

    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <script
            src={`https://cdn.polyfill.io/v3/polyfill.js?features=${polyfillFeatures.join(
              ','
            )}`}
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png"
          />
          <link
            rel="shortcut icon"
            href="https://i.wellcomecollection.org/assets/icons/favicon.ico"
            type="image/ico"
          />
          <link
            rel="icon"
            type="image/png"
            href="https://i.wellcomecollection.org/assets/icons/favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="https://i.wellcomecollection.org/assets/icons/favicon-16x16.png"
            sizes="16x16"
          />
          <link
            rel="manifest"
            href="https://i.wellcomecollection.org/assets/icons/manifest.json"
          />
          <link
            rel="mask-icon"
            href="https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg"
            color="#000000"
          />
          <script
            src="https://i.wellcomecollection.org/assets/libs/picturefill.min.js"
            async
          />
          <JsonLd data={museumLd(wellcomeCollectionGalleryWithHours)} />
          <JsonLd data={libraryLd(wellcomeLibraryWithHours)} />
        </Head>
        <UtilsContext.Provider value={{ isKeyboard, isEnhanced }}>
          <TogglesContext.Provider value={{ ...togglesContext, updateToggles }}>
            <OpeningTimesContext.Provider value={parsedOpeningTimes}>
              <GlobalAlertContext.Provider value={globalAlert}>
                <ThemeProvider theme={theme}>
                  <OutboundLinkTracker>
                    <Fragment>
                      <TogglesContext.Consumer>
                        {({ helveticaRegular }) =>
                          helveticaRegular && (
                            <style
                              type="text/css"
                              dangerouslySetInnerHTML={{
                                __html: `
                                  @font-face {
                                    font-family: 'Helvetica Neue Light Web';
                                    src: local('Helvetica Neue Regular'),
                                      local('HelveticaNeue-Regular'),
                                      url('https://i.wellcomecollection.org/assets/fonts/d460c8dd-ab48-422e-ac1c-d9b6392b605a.woff2') format('woff2'),
                                      url('https://i.wellcomecollection.org/assets/fonts/955441c8-2039-4256-bf4a-c475c31d1c0d.woff') format('woff');
                                    font-weight: normal;
                                    font-style: normal;
                                  }

                                  @font-face {
                                    font-family: 'Helvetica Neue Medium Web';
                                    src: local('Helvetica Neue Bold'),
                                      local('HelveticaNeue-Bold'),
                                      url('https://i.wellcomecollection.org/assets/fonts/455d1f57-1462-4536-aefa-c13f0a67bbbe.woff2') format('woff2'),
                                      url('https://i.wellcomecollection.org/assets/fonts/fd5c4818-7809-4a21-a48d-a0dc15aa47b8.woff') format('woff');
                                    font-weight: normal;
                                    font-style: normal;
                                  }
                                `,
                              }}
                            />
                          )
                        }
                      </TogglesContext.Consumer>
                      <LoadingIndicator />
                      <TrackerScript />
                      {!pageProps.statusCode && <Component {...pageProps} />}
                      {pageProps.statusCode && pageProps.statusCode !== 200 && (
                        <ErrorPage statusCode={pageProps.statusCode} />
                      )}
                    </Fragment>
                  </OutboundLinkTracker>
                </ThemeProvider>
              </GlobalAlertContext.Provider>
            </OpeningTimesContext.Provider>
          </TogglesContext.Provider>
        </UtilsContext.Provider>
      </>
    );
  }
}
