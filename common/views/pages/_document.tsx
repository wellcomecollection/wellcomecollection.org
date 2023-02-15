import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Main,
  NextScript,
  Html,
} from 'next/document';
import { ReactElement } from 'react';
import { ServerStyleSheet } from 'styled-components';
import * as snippet from '@segment/snippet';
import { getServerData } from '@weco/common/server-data';
import { Toggles } from '@weco/toggles';
import {
  DataLayer,
  GoogleAnalyticsUA,
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from '../../services/app/google-analytics';

const {
  ANALYTICS_WRITE_KEY = '78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI',
  NODE_ENV = 'development',
} = process.env;

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

type DocumentInitialPropsWithToggles = DocumentInitialProps & {
  toggles: Toggles;
};
class WecoDoc extends Document<DocumentInitialPropsWithToggles> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialPropsWithToggles> {
    const serverData = await getServerData(ctx);
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        toggles: serverData.toggles,
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
      <Html lang="en" className="is-keyboard">
        <Head>
          {/* W3C standard: The element containing the character encoding declaration
          must be serialized completely within the first 1024 bytes of the document.
          It has to be declared here as Next dynamically adds other elements to the Head */}
          <meta charSet="utf-8" />
          {/* Adding toggles to the datalayer so it is available to events in Google Tag Manager */}
          <DataLayer data={{ toggles: this.props.toggles }} />
          <GoogleTagManager />
          <GoogleAnalyticsUA />
          <script
            dangerouslySetInnerHTML={{ __html: renderSegmentSnippet() }}
          />
        </Head>
        <body>
          <GoogleTagManagerNoScript />
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
