import Document, { Head, Main, NextScript } from 'next/document';
// $FlowFixMe
import css from '../../styles/critical.scss';

export default class WecoDoc extends Document {
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
}
