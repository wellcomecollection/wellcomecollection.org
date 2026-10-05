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

import { apmConfigScriptId } from '@weco/common/contexts/ApmContext';
import { ConsentStatusProps } from '@weco/common/server-data/types';
import apmConfig from '@weco/common/services/apm/apmConfig';
import {
  Ga4DataLayer,
  GoogleTagManager,
} from '@weco/common/services/app/analytics-scripts';
import { getErrorPageConsent } from '@weco/common/services/app/civic-uk';
import { Toggles } from '@weco/toggles';

type DocumentInitialPropsWithTogglesAndGa = DocumentInitialProps & {
  toggles: Toggles;
  consentStatus: ConsentStatusProps;
};

// _document only renders on the server, so this reads the env vars at
// runtime, and the result is picked up in the browser by ApmContextProvider.
// Escaping `<` stops a value from closing the script tag early.
const serialisedApmConfig = () =>
  JSON.stringify(
    apmConfig.client(process.env.NEXT_PUBLIC_APM_SERVICE_NAME)
  ).replace(/</g, '\\u003c');
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

      return {
        ...initialProps,
        toggles: pageProps?.serverData?.toggles,
        consentStatus,
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
          <>
            <script
              id={apmConfigScriptId}
              type="application/json"
              dangerouslySetInnerHTML={{ __html: serialisedApmConfig() }}
            />

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
