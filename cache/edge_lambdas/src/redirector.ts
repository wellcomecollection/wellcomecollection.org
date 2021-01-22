import { CloudFrontRequestEvent, CloudFrontResponse } from 'aws-lambda';
import { URLSearchParams } from 'url';
import { literalRedirects, queryRedirects } from './redirects';

// This is a more convenient form of the query redirects that looks like:
// {
//   [original path to match]: {
//     params: [URLSearchParams to match]
//     redirectPath: [path to redirect to]
//   }
// }
const searchParamsRedirects: Map<
  string,
  { params: URLSearchParams; redirectPath: string }
> = new Map();
for (const fromString in queryRedirects) {
  const fromUrl = new URL(fromString, 'https://wellcomecollection.org');
  const params = fromUrl.searchParams;
  searchParamsRedirects.set(fromUrl.pathname, {
    params,
    redirectPath: queryRedirects[fromString],
  });
}

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

  if (request.querystring && searchParamsRedirects.has(uriSansSlash)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const potentialRedirect = searchParamsRedirects.get(uriSansSlash)!;
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
