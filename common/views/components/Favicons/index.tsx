import { FunctionComponent } from 'react';

const Favicons: FunctionComponent = () => {
  return (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png"
      />
      <link
        rel="shortcut icon"
        href="https://i.wellcomecollection.org/assets/icons/favicon.ico"
        type="image/ico"
      />
      <link
        rel="icon"
        type="image/png"
        href="https://i.wellcomecollection.org/assets/icons/favicon-32x32.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="https://i.wellcomecollection.org/assets/icons/favicon-16x16.png"
        sizes="16x16"
      />
      <link
        rel="manifest"
        href="https://i.wellcomecollection.org/assets/icons/manifest.json"
      />
      <link
        rel="mask-icon"
        href="https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg"
        color="#000000"
      />
    </>
  );
};

export default Favicons;
