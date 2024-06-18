import * as snippet from '@segment/snippet';

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

const SegmentScript = () => (
  <script
    id="segment"
    dangerouslySetInnerHTML={{ __html: renderSegmentSnippet() }}
  />
);

export default SegmentScript;
