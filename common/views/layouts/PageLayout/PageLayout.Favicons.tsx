import Head from 'next/head';
import { FunctionComponent } from 'react';

const ICONS_URL = 'https://i.wellcomecollection.org/assets/icons/brand-update';

const Favicons: FunctionComponent = () => {
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${ICONS_URL}/apple-touch-icon.png`}
      />
      <link
        rel="shortcut icon"
        href={`${ICONS_URL}/favicon.ico`}
        type="image/ico"
      />
      <link
        rel="icon"
        type="image/png"
        href={`${ICONS_URL}/favicon-32x32.png`}
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href={`${ICONS_URL}/favicon-16x16.png`}
        sizes="16x16"
      />
      <link rel="manifest" href={`${ICONS_URL}/manifest.json`} />
      <link
        rel="mask-icon"
        href="https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg"
        color="#223438"
      />
    </Head>
  );
};

export default Favicons;
