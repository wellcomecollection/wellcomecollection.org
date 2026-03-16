import { Context } from 'aws-lambda';

import * as origin from './origin';
import testRequest from './test_event_request';
import testResponse from './test_event_response';

test('request', async () => {
  const requestResult = await origin.request(testRequest, {} as Context);
  const responseResult = await origin.response(testResponse, {} as Context);

  expect(typeof requestResult).toBe('object');
  expect(typeof responseResult).toBe('object');
});
