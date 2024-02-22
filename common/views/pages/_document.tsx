import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Main,
  NextScript,
  Html,
} from 'next/document';
import { useEffect, ReactElement, FunctionComponent } from 'react';
import { ServerStyleSheet } from 'styled-components';
import * as snippet from '@segment/snippet';
import { Toggles } from '@weco/toggles';
import {
  Ga4DataLayer,
  GoogleTagManager,
  GoogleTagManagerNoScript,
  GaDimensions,
} from '../../services/app/google-analytics';
import { getConsentState } from '@weco/common/utils/cookie-consent';

const {
  ANALYTICS_WRITE_KEY = '78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI',
  NODE_ENV = 'development',
} = process.env;

const CookieControl: FunctionComponent = () => {
  // TODO: I'd expect this to shout when the event is fired, but it doesn't :\
  useEffect(() => {
    const sayHello = () => {
      console.log('HEELLO');
    };

    window.addEventListener('analyticsConsentWithdrawn', sayHello);

    return () => {
      window.removeEventListener('analyticsConsentWithdrawn', sayHello);
    };
  });

  return (
    <>
      <script
        src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
        type="text/javascript"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `CookieControl.load({
                product: 'COMMUNITY',
                apiKey: '73fee8f69cf633d66fae404ddd69d2559af7f887',
                necessaryCookies: ['toggle_*'],
                optionalCookies: [
                  {
                      name: 'analytics',
                      label: 'Google Analytics',
                      description: 'Analytical cookies help us to improve our website by collecting and reporting information on its usage.',
                      cookies: ['_ga', '_ga*', '_gid', '_gat', '__utma', '__utmt', '__utmb', '__utmc', '__utmz', '__utmv'],
                      onAccept: function(){
                          console.log('analytics accepted');
                      },
                      onRevoke: function(){
                          console.log('analytics rejected');
                          // TODO: Hoping we can listen for this in a component and react to it!
                          const event = new CustomEvent('analyticsConsentWithdrawn', {});
                          window.dispatchEvent(event);
                      }
                  }
                ]
              });`,
        }}
      />
    </>
  );
};

function renderSegmentSnippet() {
  const opts = {
    apiKey: ANALYTICS_WRITE_KEY,
    page: false,
  };

  if (NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

type DocumentInitialPropsWithTogglesAndGa = DocumentInitialProps & {
  toggles: Toggles;
  hasAnalyticsConsent: boolean;
  gaDimensions?: GaDimensions;
};
class WecoDoc extends Document<DocumentInitialPropsWithTogglesAndGa> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialPropsWithTogglesAndGa> {
    const sheet = new ServerStyleSheet();
    let pageProps;
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => {
            pageProps = props.pageProps;
            return sheet.collectStyles(<App {...props} />);
          },
        });

      const initialProps = await Document.getInitialProps(ctx);

      const hasAnalyticsConsent = getConsentState(ctx).analytics;
      console.log('hasAnalyticsConsent (server)', hasAnalyticsConsent);

      return {
        ...initialProps,
        toggles: pageProps.serverData?.toggles,
        gaDimensions: pageProps.gaDimensions,
        hasAnalyticsConsent,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): ReactElement<DocumentInitialProps> {
    return (
      <Html lang="en">
        <Head>
          <CookieControl />
          {this.props.hasAnalyticsConsent && (
            <>
              {/* Adding toggles etc. to the datalayer so they are available to events in Google Tag Manager */}
              <Ga4DataLayer
                data={{
                  toggles: this.props.toggles,
                }}
              />
              <GoogleTagManager />
              <script
                dangerouslySetInnerHTML={{ __html: renderSegmentSnippet() }}
              />
            </>
          )}
        </Head>
        <body>
          {this.props.hasAnalyticsConsent && <GoogleTagManagerNoScript />}
          <div id="top">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default WecoDoc;
