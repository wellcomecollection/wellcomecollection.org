import type { AppProps } from 'next/app';
import Head from 'next/head';

import GlobalStyles from '@weco/dash/views/themes/GlobalStyles';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
