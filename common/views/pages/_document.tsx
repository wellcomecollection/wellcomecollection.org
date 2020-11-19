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

const {
  ANALYTICS_WRITE_KEY = '78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI',
  NODE_ENV = 'development',
} = process.env;

function renderSegmentSnippet() {
  const opts = {
    apiKey: ANALYTICS_WRITE_KEY,
    page: true,
  };

  if (NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

class WecoDoc extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
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
      <Html id="top" lang="en" className="is-keyboard">
        <Head>
          {/* GA v4 */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-206J7SLYFC"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-206J7SLYFC');`,
            }}
          />

          <script
            dangerouslySetInnerHTML={{ __html: renderSegmentSnippet() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default WecoDoc;
