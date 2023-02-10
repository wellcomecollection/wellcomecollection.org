import NextApp, { AppContext, AppProps } from 'next/app';
import App from '@weco/common/views/pages/_app';
import { SearchContextProvider } from '@weco/common/views/components/SearchContext/SearchContext';
import { ReactElement } from 'react';

export default function CatalogueApp(props: AppProps): ReactElement {
  return (
    <SearchContextProvider>
      <App {...props} />
    </SearchContextProvider>
  );
}

// This is here to disable Automatic Static Optimisation as per
// https://nextjs.org/docs/basic-features/typescript#custom-app
// https://nextjs.org/docs/advanced-features/automatic-static-optimization#caveats
//
// Explicit static generation will still be possible:
// https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
//
// This is necessary because statically generated pages will have
// fixed asset prefixes, which is not compatible with using the same
// application images in staging and production environments (which
// require different prefixes).
CatalogueApp.getInitialProps = async (appContext: AppContext) => {
  const initialProps = await NextApp.getInitialProps(appContext);

  return { ...initialProps };
};
