// @flow
import {Fragment} from 'react';
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
            {this.props.usePolyfill &&
              <Fragment>
                <script src='https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.23.0/polyfill.min.js' />
                <script src='https://cdn.polyfill.io/v2/polyfill.min.js'></script>
              </Fragment>
            }
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
