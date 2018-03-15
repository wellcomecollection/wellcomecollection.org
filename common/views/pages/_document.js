// @flow
import Document, { Head, Main, NextScript } from 'next/document';

export default function WeDoc(css: string) {
  return class WecoDoc extends Document {
    render() {
      return (
        <html>
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
