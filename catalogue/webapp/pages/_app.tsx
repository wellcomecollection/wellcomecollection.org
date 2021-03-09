import { NextWebVitalsMetric, AppProps } from 'next/app';
import App from '@weco/common/views/pages/_app';
import { SearchContextProvider } from '@weco/common/views/components/SearchContext/SearchContext';
import { gtagReportWebVitals } from '@weco/common/utils/gtag';
import '../styles.scss';

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  gtagReportWebVitals(metric);
}

export default function CatalogueApp(props: AppProps) {
  return (
    <SearchContextProvider>
      <App {...props} />
    </SearchContextProvider>
  );
}
