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

    {/* These still don't trigger on consent change */}
    {/* We need to load them on consent added... */}
    {/* If we want these on first page load then we need page reload, but that might faked data since it's been cached at that point */}
    {/* TODO add a what and why? Or a link? */}
    <PerformanceTimingTrackingScript />

    {/* https://github.com/wellcomecollection/wellcomecollection.org/issues/9286 */}
    <CoreWebVitalsScript />
  </>
);

export { AnalyticsScripts, Ga4DataLayer, GoogleTagManager };
export type { GaDimensions };
