// @flow
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import JsonLd from '../../views/components/JsonLd/JsonLd';
import { museumLd, libraryLd } from '../../utils/json-ld';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionLibrary,
} from '../../model/organization';

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
        <html id="top" lang="en">
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
            <JsonLd data={museumLd(wellcomeCollectionGallery)} />
            <JsonLd data={libraryLd(wellcomeCollectionLibrary)} />
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
