// @flow
import Document, { Head, Main, NextScript } from 'next/document';

export default function WeDoc(css: string) {
  return class WecoDoc extends Document {
    static async getInitialProps (context: any) {
      const props = await super.getInitialProps(context);
      const userAgent = context.req.headers['user-agent'];
      const isIE11 = !!userAgent.match(/Trident\/7\./);
      const isIE10 = !!userAgent.match(/MSIE 10/g);
      return { ...props, usePolyfill: isIE10 || isIE11 };
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
