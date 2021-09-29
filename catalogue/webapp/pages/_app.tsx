import NextApp, { NextWebVitalsMetric, AppContext } from 'next/app';
import App, { WecoAppProps } from '@weco/common/views/pages/_app';
import { SearchContextProvider } from '@weco/common/views/components/SearchContext/SearchContext';
import { gtagReportWebVitals } from '@weco/common/utils/gtag';
import { getGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import TogglesContext, {
  parseTogglesFromPageContext,
} from '@weco/common/views/components/TogglesContext/TogglesContext';
import { Toggles } from '@weco/toggles';

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  gtagReportWebVitals(metric);
}

type Props = WecoAppProps & { toggles: Toggles };
export default function CatalogueApp(props: Props) {
  return (
    <TogglesContext.Provider value={props.toggles}>
      <SearchContextProvider>
        <App {...props} />
      </SearchContextProvider>
    </TogglesContext.Provider>
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
  const globalContextData = getGlobalContextData(appContext.ctx);
  const toggles = parseTogglesFromPageContext(appContext.ctx);
  const initialProps = await NextApp.getInitialProps(appContext);

  // TODO don't store things like this on `ctx.query`
  delete appContext.ctx.query.memoizedPrismic; // We need to remove memoizedPrismic value here otherwise we hit circular object issues with JSON.stringify

  return { ...initialProps, globalContextData, toggles };
};
