import { NextWebVitalsMetric } from 'next/app';
import App from '@weco/common/views/pages/_app-deprecated';
import { gtagReportWebVitals } from '@weco/common/utils/gtag';
import '../styles.scss';
export function reportWebVitals(metric: NextWebVitalsMetric): void {
  gtagReportWebVitals(metric);
}
export default App;
