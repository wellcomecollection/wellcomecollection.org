const abTesting = require('./ab_testing');
const testEventRequest = require('./test_event_request');

test('request', () => {
  abTesting.setTests([{
    id: 'outro',
    title: 'Outro',
    shouldRun: (request) => {
      return request.uri.match(/^\/articles\/*/);
    }
  }]);

  const requestCallback = jest.fn((_, request) => request);

  // To avoid the mutation that happens
  const oldRequest = JSON.parse(JSON.stringify(testEventRequest.Records[0].cf.request));
  abTesting.request(testEventRequest, {}, requestCallback);
  const newRequest = requestCallback.mock.results[0].value;

  expect(requestCallback.mock.calls.length).toBe(1);

  // 1. set the new value on the cookie forwarded to the application
  expect(oldRequest.headers.cookie[0].value).not.toMatch(/toggle_outro=(true|false)/);
  expect(newRequest.headers.cookie[0].value).toMatch(/toggle_outro=(true|false)/);

  // 2. set the x-toggled that will be forwarded to the response
  expect(oldRequest.headers['x-toggled']).toBeUndefined();
  expect(newRequest.headers['x-toggled'][0].value).toMatch(/toggle_outro=(true|false)/);

  // This is just the shape of the
  const testEventResponse = {
    Records: [{
      cf: {
        request: newRequest,
        response: {
          uri: '/articles/things',
          method: 'GET',
          clientIp: '2001:cdba::3257:9652',
          headers: {},
          status: 2000
        }
      }
    }]
  };

  const responseCallback = jest.fn((_, response) => response);
  abTesting.response(testEventResponse, {}, responseCallback);
  const newResponse = responseCallback.mock.results[0].value;

  // 3. set cookie is set fromxz-toggled to lock the person in for the session
  expect(responseCallback.mock.calls.length).toBe(1);
  expect(newResponse.headers['set-cookie'][0].value).toMatch(/toggle_outro=(true|false); Path=\/;/);
});
