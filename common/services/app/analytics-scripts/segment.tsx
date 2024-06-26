import * as snippet from '@segment/snippet';
import { useEffect } from 'react';

// Don't attempt to destructure the process object
// https://github.com/vercel/next.js/pull/20869/files
const ANALYTICS_WRITE_KEY =
  process.env.ANALYTICS_WRITE_KEY || '78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI';
const NODE_ENV = process.env.NODE_ENV || 'development';

function renderSegmentSnippet() {
  const opts = {
    apiKey: ANALYTICS_WRITE_KEY,
    page: false,
  };

  if (NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

const SegmentScript = ({ hasAnalyticsConsent }) => {
  useEffect(() => {
    const isScriptInDOM = document.getElementById('segment-script');
    console.log({ hasAnalyticsConsent, isScriptInDOM });
    // const script = document.createElement('script');

    // script.innerHTML = 'window.alert("jdjd");'; // renderSegmentSnippet()
    // script.id = 'segment-script';
    // script.async = true;

    if (isScriptInDOM) {
      if (!hasAnalyticsConsent) {
        console.log('remove scripts and cookies');
        // document.body.removeChild(script);
        // https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#reset-or-log-out
        window.analytics.reset();
      }
    } else {
      if (hasAnalyticsConsent) {
        console.log('add script and trigger functions');
        // document.body.appendChild(script);
      }
    }
  }, [hasAnalyticsConsent]);

  // TODO we need this to fire on being added and not just on page load
  // It adds the cdn script which doesn't get removed either

  return (
    <script
      id="segment-script"
      dangerouslySetInnerHTML={{
        __html: renderSegmentSnippet(),
      }}
    />
  );
};

export default SegmentScript;
