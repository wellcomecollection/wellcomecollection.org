import {
  CloudFrontRequestEvent,
  CloudFrontRequestResult,
  CloudFrontResponseEvent,
  CloudFrontResponseResult,
  Context,
} from 'aws-lambda';

import { getRedirect } from './redirector';
import * as abTesting from './toggler';

// Note: Lambda handlers must accept both event and context parameters, even if unused.
// AWS Lambda runtime always provides context (containing request ID, remaining time, etc.)
// and the handler signature must match the expected interface.
// Node 24 removed callback support, so handlers now return Promise<Result> instead.
export const request = async (
  event: CloudFrontRequestEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): Promise<CloudFrontRequestResult> => {
  const redirectResponse = getRedirect(event);
  if (redirectResponse) {
    return redirectResponse;
  }

  const request = event.Records[0].cf.request;
  abTesting.request(event);
  return request;
};

export const response = async (
  event: CloudFrontResponseEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): Promise<CloudFrontResponseResult> => {
  const response = event.Records[0].cf.response;

  abTesting.response(event);
  return response;
};
