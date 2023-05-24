import * as abTesting from './toggler';
import { getRedirect } from './redirector';
import {
  CloudFrontRequestHandler,
  CloudFrontResponseHandler,
} from 'aws-lambda';
import { getRejection } from './rejection';

export const request: CloudFrontRequestHandler = (event, context, callback) => {
  const rejectResponse = getRejection(event);
  if (rejectResponse) {
    callback(null, rejectResponse);
    return;
  }

  const redirectResponse = getRedirect(event);
  if (redirectResponse) {
    callback(null, redirectResponse);
    return;
  }

  const request = event.Records[0].cf.request;
  abTesting.request(event);
  callback(null, request);
};

export const response: CloudFrontResponseHandler = (
  event,
  context,
  callback
) => {
  const response = event.Records[0].cf.response;

  abTesting.response(event);
  callback(null, response);
};
