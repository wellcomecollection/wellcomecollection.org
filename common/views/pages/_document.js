// @flow
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default function WeDoc(css: string) {
  return class WecoDoc extends Document {
    static async getInitialProps(ctx: any) {
      const sheet = new ServerStyleSheet();
      const page = ctx.renderPage(App => props => sheet.collectStyles(<App {...props} />));
      const styleTags = sheet.getStyleElement();
      return { ...page, styleTags };
    }

    render() {
      return (
        <html id='top' lang='en'>
          <Head>
            {this.props.styleTags}
            <style dangerouslySetInnerHTML={{ __html: css }} />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </html>
      );
    }
  };
}
