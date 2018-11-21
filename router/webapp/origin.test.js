const origin = require('./origin');
const testRequest = require('./test_event_request.json');
const testResponse = require('./test_event_response.json');

test('request', () => {
  const requestCallback = jest.fn((_, request) => request);
  const responseCallback = jest.fn((_, request) => request);

  origin.request(testRequest, {}, requestCallback);
  origin.response(testResponse, {}, responseCallback);

  expect(requestCallback.mock.calls.length).toBe(1);
  expect(responseCallback.mock.calls.length).toBe(1);
});
