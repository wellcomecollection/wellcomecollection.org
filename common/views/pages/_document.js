// @flow
import type {Context} from 'next';
import Document, { Head, Main, NextScript } from 'next/document';

export default function WeDoc(css: string) {
  return class WecoDoc extends Document {
    static async getInitialProps(ctx: Context) {
      const initialProps = await Document.getInitialProps(ctx);
      return { ...initialProps };
    }

    render() {
      return (
        <html id='top' lang='en'>
          <Head>
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
