import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ReactElement } from 'react';
import { ServerStyleSheet } from 'styled-components';

import { ConsentStatusProps } from '@weco/common/server-data/types';
import {
  Ga4DataLayer,
  GoogleTagManager,
} from '@weco/common/services/app/analytics-scripts';
import { getErrorPageConsent } from '@weco/common/services/app/civic-uk';
import { Toggles } from '@weco/toggles';

type DocumentInitialPropsWithTogglesAndGa = DocumentInitialProps & {
  toggles: Toggles;
  consentStatus: ConsentStatusProps;
  environment?: string;
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

      const consentStatus = pageProps?.serverData
        ? pageProps.serverData?.consentStatus
        : getErrorPageConsent({ req: ctx.req, res: ctx.res });

      // Get environment from APM_ENVIRONMENT for robots meta tag
      const environment = process.env.APM_ENVIRONMENT || 'dev';

      return {
        ...initialProps,
        toggles: pageProps?.serverData?.toggles,
        consentStatus,
        environment,
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
    // Add noindex meta tag for non-production environments
    const shouldNoindex = this.props.environment !== 'prod';

    return (
      <Html lang="en">
        <Head>
          <>
            {/* Prevent indexing of non-production environments */}
            {shouldNoindex && (
              <meta name="robots" content="noindex, nofollow" />
            )}

            {/* Adding toggles etc. to the datalayer so they are available to events in Google Tag Manager */}
            <Ga4DataLayer
              consentStatus={this.props.consentStatus}
              data={{ toggles: this.props.toggles }}
            />

            {/* Removing/readding this script on consent changes causes issues with meta tag duplicates
            https://github.com/wellcomecollection/wellcomecollection.org/pull/10685#discussion_r1516298683
            Let's keep an eye on this issue and consider moving it when it's fixed */}
            <GoogleTagManager />
          </>
        </Head>
        <body>
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
