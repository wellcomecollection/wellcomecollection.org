import { CloudFrontRequestEvent, CloudFrontResponse } from 'aws-lambda';
import redirects from './redirects';

export const getRedirect = (
  event: CloudFrontRequestEvent
): CloudFrontResponse | undefined => {
  const cf = event.Records[0].cf;
  const request = cf.request;
  const uriSansSlash = request.uri.replace(/\/$/, '');
  if (redirects[uriSansSlash]) {
    return {
      status: '301',
      statusDescription: 'Found',
      headers: {
        location: [
          {
            key: 'Location',
            value: `https://wellcomecollection.org${redirects[uriSansSlash]}`,
          },
        ],
        'x-powered-by': [
          {
            key: 'x-powered-by',
            value: '@weco/redirector',
          },
        ],
      },
    };
  }
};
