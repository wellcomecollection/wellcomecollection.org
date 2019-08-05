const origin = require('./origin');
const testRequest = require('./test_event_request');
const testResponse = require('./test_event_response');

test('request', () => {
  const requestCallback = jest.fn((_, request) => request);
  const responseCallback = jest.fn((_, request) => request);

  origin.request(testRequest, {}, requestCallback);
  origin.response(testResponse, {}, responseCallback);

  expect(typeof requestCallback.mock.calls[0][1]).toBe('object');
  expect(typeof responseCallback.mock.calls[0][1]).toBe('object');

  expect(requestCallback.mock.calls.length).toBe(1);
  expect(responseCallback.mock.calls.length).toBe(1);
});
