import NextApp, { AppContext, NextWebVitalsMetric } from 'next/app';
import { gtagReportWebVitals } from '@weco/common/utils/gtag';
import App, { WecoAppProps } from '@weco/common/views/pages/_app';

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  gtagReportWebVitals(metric);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function IdentityApp(props: WecoAppProps) {
  return (
    <App
      {...props}
      // We can remove this once we have removed globalContextData
      globalContextData={{
        toggles: { enableRequestion: true },
        globalAlert: null,
      }}
    />
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
  const initialProps = await NextApp.getInitialProps(appContext);
  // TODO don't store things like this on `ctx.query`
  delete appContext.ctx.query.memoizedPrismic; // We need to remove memoizedPrismic value here otherwise we hit circular object issues with JSON.stringify

  return {
    ...initialProps,
  };
};
