import SegmentScript from './segment';
import CoreWebVitalsScript from './core-web-vitals';
import PerformanceTimingTrackingScript from './performance-timing-tracking';
import {
  Ga4DataLayer,
  GoogleTagManager,
  GaDimensions,
} from './google-analytics';

const AnalyticsScripts = () => (
  <>
    {/* SEGMENT */}
    {/* We're using their Analytics.js snippet instead of using their API and doing it ourselves */}
    {/* It doesn't offer a way to "unload" the script so we just gate it behind the analytics consent condition in _document.tsx */}
    {/* https://github.com/wellcomecollection/wellcomecollection.org/issues/10796 */}
    <SegmentScript />

    {/* https://github.com/wellcomecollection/wellcomecollection.org/issues/10090 */}
    <PerformanceTimingTrackingScript />

    {/* https://github.com/wellcomecollection/wellcomecollection.org/issues/9286 */}
    <CoreWebVitalsScript />
  </>
);

export { AnalyticsScripts, Ga4DataLayer, GoogleTagManager };
export type { GaDimensions };
