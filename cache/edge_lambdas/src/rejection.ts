import { CloudFrontRequestEvent, CloudFrontResponse } from 'aws-lambda';

export const getRejection = (
  event: CloudFrontRequestEvent
): CloudFrontResponse | undefined => {
  const cf = event.Records[0].cf;
  const request = cf.request;

  const requestParams = new URLSearchParams(request.querystring);
  const query = requestParams.getAll('query').join(' ');

  console.log(query);

  return undefined;
};
