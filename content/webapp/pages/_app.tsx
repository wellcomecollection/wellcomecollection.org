import NextApp, { AppContext, AppProps } from 'next/app';
import { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

import App from '@weco/common/views/pages/_app';
import themeValues from '@weco/common/views/themes/default';
import { CartContextProvider } from '@weco/content/contexts/CartContext';
import CartDrawer from '@weco/content/views/components/CartDrawer';

export default function ContentApp(props: AppProps): ReactElement {
  return (
    <CartContextProvider>
      <App {...props} />
      <ThemeProvider theme={themeValues}>
        <CartDrawer />
      </ThemeProvider>
    </CartContextProvider>
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
ContentApp.getInitialProps = async (appContext: AppContext) => {
  const initialProps = await NextApp.getInitialProps(appContext);

  return { ...initialProps };
};
