import { NextWebVitalsMetric } from 'next/app';
import App from '@weco/common/views/pages/_app';
// this css should be included in the ColorPicker component
// but is causing this error https://err.sh/next.js/css-npm
import 'react-colorful/dist/index.css';
import '@weco/common/views/components/ColorPicker/react-colorful-overrides.css';
import { gtagReportWebVitals } from '@weco/common/utils/gtag';
import '../styles.scss';

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  gtagReportWebVitals(metric);
}

export default App;
