import { Context } from 'aws-lambda';

import * as origin from './origin';
import testRequest from './test_event_request';
import testResponse from './test_event_response';

test('request', () => {
  const requestCallback = jest.fn((_, request) => request);
  const responseCallback = jest.fn((_, request) => request);

  origin.request(testRequest, {} as Context, requestCallback);
  origin.response(testResponse, {} as Context, responseCallback);

  expect(typeof requestCallback.mock.calls[0][1]).toBe('object');
  expect(typeof responseCallback.mock.calls[0][1]).toBe('object');

  expect(requestCallback.mock.calls.length).toBe(1);
  expect(responseCallback.mock.calls.length).toBe(1);
});
