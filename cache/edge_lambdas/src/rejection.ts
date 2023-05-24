import { CloudFrontRequestEvent, CloudFrontResponse } from 'aws-lambda';
import { redirect301 } from './redirector';

const countChineseCharacters = (s: string) => {
  const chineseCharCount = s
    .split('')
    .map(c => c.charCodeAt(0))
    .filter(code => code >= 13312 && code <= 64255).length;
  return chineseCharCount / s.length;
};

export const getRejection = (
  event: CloudFrontRequestEvent
): CloudFrontResponse | undefined => {
  const cf = event.Records[0].cf;
  const request = cf.request;

  const requestParams = new URLSearchParams(request.querystring);
  const query = requestParams.getAll('query').join(' ');

  if (query.length >= 100 && countChineseCharacters(query) > 0.5) {
    const hostHeader = cf.request.headers.host;
    const requestHost =
      hostHeader && hostHeader.length > 0 ? hostHeader[0].value : undefined;

    const host =
      requestHost &&
      requestHost.indexOf('www-stage.wellcomecollection.org') !== -1
        ? 'www-stage.wellcomecollection.org'
        : 'wellcomecollection.org';

    const params = new URLSearchParams();
    params.set('originalUrl', `${request.uri}?${request.querystring}`);

    return redirect301(host, `/404?${params}`);
  }

  console.log(query);

  return undefined;
};
