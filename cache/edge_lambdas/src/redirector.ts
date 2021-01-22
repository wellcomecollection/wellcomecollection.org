import { CloudFrontRequestEvent, CloudFrontResponse } from 'aws-lambda';
import { URLSearchParams } from 'url';
import { literalRedirects, queryRedirects } from './redirects';

const redirect301 = (path: string) => ({
  status: '301',
  statusDescription: 'Found',
  headers: {
    location: [
      {
        key: 'Location',
        value: `https://wellcomecollection.org${path}`,
      },
    ],
    'x-powered-by': [
      {
        key: 'x-powered-by',
        value: '@weco/redirector',
      },
    ],
  },
});

// Returns true if and only if all of the params in `subset` are
// also contained within `superset`
const paramsAreSubset = (
  superset: URLSearchParams,
  subset: URLSearchParams
): boolean => {
  for (const pair of subset.entries()) {
    const [key, value] = pair;
    if (superset.get(key) !== value) {
      return false;
    }
  }
  return true;
};

export const getRedirect = (
  event: CloudFrontRequestEvent
): CloudFrontResponse | undefined => {
  const cf = event.Records[0].cf;
  const request = cf.request;
  const uriSansSlash = request.uri.replace(/\/$/, '');
  if (literalRedirects[uriSansSlash]) {
    return redirect301(literalRedirects[uriSansSlash]);
  }

  if (request.querystring && queryRedirects[uriSansSlash]) {
    const potentialRedirect = queryRedirects[uriSansSlash];
    const requestParams = new URLSearchParams(request.querystring);

    // A redirect occurs if all of the params in the redirect rule are contained
    // within the request
    if (paramsAreSubset(requestParams, potentialRedirect.params)) {
      // Do not forward any of the params in the rule
      potentialRedirect.params.forEach((_, key) => requestParams.delete(key));
      const requestParamsString = requestParams.toString();
      return redirect301(
        requestParamsString
          ? potentialRedirect.redirectPath + '?' + requestParamsString
          : potentialRedirect.redirectPath
      );
    }
  }

  return undefined;
};
