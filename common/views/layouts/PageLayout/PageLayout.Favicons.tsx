import Head from 'next/head';
import { FunctionComponent } from 'react';

import { useFeatureFlags } from '@weco/common/server-data/Context';

const Favicons: FunctionComponent = () => {
  const { brandUpdate } = useFeatureFlags();
  const iconsUrl = brandUpdate
    ? 'https://i.wellcomecollection.org/assets/icons/brand-update'
    : 'https://i.wellcomecollection.org/assets/icons';

  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${iconsUrl}/apple-touch-icon.png`}
      />
      <link
        rel="shortcut icon"
        href={`${iconsUrl}/favicon.ico`}
        type="image/ico"
      />
      <link
        rel="icon"
        type="image/png"
        href={`${iconsUrl}/favicon-32x32.png`}
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href={`${iconsUrl}/favicon-16x16.png`}
        sizes="16x16"
      />
      <link rel="manifest" href={`${iconsUrl}/manifest.json`} />
      <link
        rel="mask-icon"
        href="https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg"
        color={brandUpdate ? '#223438' : '#000000'}
      />
    </Head>
  );
};

export default Favicons;
