import * as snippet from '@segment/snippet';
import { useEffect } from 'react';

// Don't attempt to destructure the process object
// https://github.com/vercel/next.js/pull/20869/files
const ANALYTICS_WRITE_KEY =
  process.env.ANALYTICS_WRITE_KEY || '78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI';
const NODE_ENV = process.env.NODE_ENV || 'development';

function renderSegmentSnippet(hasAnalyticsConsent) {
  const opts = {
    apiKey: ANALYTICS_WRITE_KEY,
    page: false,
    ...(!hasAnalyticsConsent && { load: false }), // don't load if consent is not given.
  };

  if (NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

const SegmentScript = ({
  hasAnalyticsConsent,
}: {
  hasAnalyticsConsent: boolean;
}) => {
  useEffect(() => {
    // If we have the Segment script and consent is denied, ensure the stored values are reset
    if (window.analytics && !hasAnalyticsConsent) {
      window.analytics.reset();
    }
  }, [hasAnalyticsConsent]);

  return (
    <script
      id="segment-script"
      dangerouslySetInnerHTML={{
        __html: renderSegmentSnippet(hasAnalyticsConsent),
      }}
    />
  );
};

export default SegmentScript;
