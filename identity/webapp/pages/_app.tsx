import NextApp, { AppContext, NextWebVitalsMetric } from 'next/app';
import { gtagReportWebVitals } from '@weco/common/utils/gtag';
import App, { WecoAppProps } from '@weco/common/views/pages/_app';
import GlobalContextProvider, {
  getGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
export function reportWebVitals(metric: NextWebVitalsMetric): void {
  gtagReportWebVitals(metric);
}

export default function IdentityApp(props: WecoAppProps) {
  return (
    <GlobalContextProvider value={props.globalContextData}>
      <App {...props} />
    </GlobalContextProvider>
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
IdentityApp.getInitialProps = async (appContext: AppContext) => {
  const globalContextData = getGlobalContextData(appContext.ctx);
  const initialProps = await NextApp.getInitialProps(appContext);
  // TODO don't store things like this on `ctx.query`
  delete appContext.ctx.query.memoizedPrismic; // We need to remove memoizedPrismic value here otherwise we hit circular object issues with JSON.stringify

  return {
    ...initialProps,
    // This is a mega hack as toggles don't work for the identity app as it doesn't use the weird
    // middleware we have in place on other apps that attaches them to the ctx.query.
    // Instead of reusing this way, we'll establish a better way, and just force `enableRequesting`
    // for now as that's required for certain identity features.
    globalContextData: {
      ...globalContextData,
      toggles: { enableRequesting: true },
    },
  };
};
