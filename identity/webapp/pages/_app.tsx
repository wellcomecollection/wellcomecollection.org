import NextApp, { AppContext, NextWebVitalsMetric } from 'next/app';
import { gtagReportWebVitals } from '@weco/common/utils/gtag';
import App, { WecoAppProps } from '@weco/common/views/pages/_app';
import { getGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
export function reportWebVitals(metric: NextWebVitalsMetric): void {
  gtagReportWebVitals(metric);
}

export default function IdentityApp(props: WecoAppProps) {
  return <App {...props} />;
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

  return { ...initialProps, globalContextData };
};
