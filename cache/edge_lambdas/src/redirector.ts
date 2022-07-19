import { CloudFrontRequestEvent, CloudFrontResponse } from 'aws-lambda';
import { URLSearchParams } from 'url';
import { literalRedirects, queryRedirects } from './redirects';

const redirect301 = (host: string, path: string) => ({
  status: '301',
  statusDescription: 'Found',
  headers: {
    location: [
      {
        key: 'Location',
        value: `https://${host}${path}`,
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

const filterParams = (
  params: URLSearchParams,
  allow: Set<string>
): URLSearchParams => {
  const filtered = new URLSearchParams();
  params.forEach((value, key) => {
    if (allow.has(key)) {
      filtered.append(key, value);
    }
  });
  return filtered;
};

export const getRedirect = (
  event: CloudFrontRequestEvent
): CloudFrontResponse | undefined => {
  const cf = event.Records[0].cf;
  const request = cf.request;
  const uriSansSlash = request.uri.replace(/\/$/, '');

  const host = 'wellcomecollection.org';

  if (literalRedirects[uriSansSlash]) {
    return redirect301(host, literalRedirects[uriSansSlash]);
  }

  if (request.querystring && queryRedirects[uriSansSlash]) {
    const potentialRedirect = queryRedirects[uriSansSlash];
    const requestParams = new URLSearchParams(request.querystring);
    // A redirect occurs if all of the params in the redirect rule are contained
    // within the request
    if (paramsAreSubset(requestParams, potentialRedirect.matchParams)) {
      // Only forward params that are in `forwardParams`
      const newParams = filterParams(
        requestParams,
        potentialRedirect.forwardParams
      );
      const requestParamsString = newParams.toString();
      return redirect301(
        host,
        requestParamsString
          ? potentialRedirect.redirectPath + '?' + requestParamsString
          : potentialRedirect.redirectPath
      );
    }
  }

  return undefined;
};
