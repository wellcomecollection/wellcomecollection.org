// @flow
import Document, { Head, Main, NextScript } from 'next/document';
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

export default function WeDoc(css: string) {
  return class WecoDoc extends Document {
    static async getInitialProps(ctx: any) {
      const sheet = new ServerStyleSheet();
      const page = ctx.renderPage(App => props =>
        sheet.collectStyles(<App {...props} />)
      );
      const styleTags = sheet.getStyleElement();
      return { ...page, styleTags };
    }

    render() {
      return (
        <html id="top" lang="en" className="is-keyboard">
          <Head>
            {/* Google Tag Manager */}
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WV9JS8W');`,
              }}
            />
            {this.props.styleTags}
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <script
              dangerouslySetInnerHTML={{ __html: renderSegmentSnippet() }}
            />
          </Head>
          <body>
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-WV9JS8W"
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
            <Main />
            <NextScript />
          </body>
        </html>
      );
    }
  };
}
