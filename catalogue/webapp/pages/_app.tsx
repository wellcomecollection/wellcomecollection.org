import { NextWebVitalsMetric, AppProps } from 'next/app';
import App from '@weco/common/views/pages/_app';
// this css should be included in the ColorPicker component
// but is causing this error https://err.sh/next.js/css-npm
import 'react-colorful/dist/index.css';
import '@weco/common/views/components/ColorPicker/react-colorful-overrides.css';
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
