const abTesting = require('./toggler');
const testEventRequest = require('./test_event_request');

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

test('x-toggled header gets added, and sends the cookie to the client', () => {
  abTesting.setTests([
    {
      id: 'outro',
      title: 'Outro',
      range: [0, 100],
      shouldRun: request => {
        return request.uri.match(/^\/articles\/*/);
      },
    },
    {
      id: 'wontrun',
      title: `Won't run`,
      range: [0, 100],
      shouldRun(request) {
        return false;
      },
    },
  ]);

  const oldRequest = copy(testEventRequest.Records[0].cf.request);

  abTesting.request(testEventRequest, {});
  const modifiedRequest = testEventRequest.Records[0].cf.request;

  // 1. set the new value on the cookie forwarded to the application
  expect(oldRequest.headers.cookie[0].value).not.toMatch(
    /toggle_outro=(true|false)/
  );
  expect(modifiedRequest.headers.cookie[0].value).toMatch(
    /toggle_outro=(true|false)/
  );

  // expect toggle_wontwork not to exist before or after modification
  expect(oldRequest.headers.cookie[0].value).not.toMatch(
    /toggle_wontwork=(true|false)/
  );
  expect(modifiedRequest.headers.cookie[0].value).not.toMatch(
    /toggle_wontwork=(true|false)/
  );

  // 2. set the x-toggled that will be forwarded to the response
  expect(oldRequest.headers['x-toggled']).toBeUndefined();
  expect(modifiedRequest.headers['x-toggled'][0].value).toMatch(
    /toggle_outro=(true|false)/
  );

  // This is just the shape of the CloudFront event
  const testEventResponse = {
    Records: [
      {
        cf: {
          request: modifiedRequest,
          response: {
            uri: '/articles/things',
            method: 'GET',
            clientIp: '2001:cdba::3257:9652',
            headers: {},
            status: 2000,
          },
        },
      },
    ],
  };

  abTesting.response(testEventResponse, {});
  const modifiedResponse = testEventResponse.Records[0].cf.response;

  // 3. set cookie is set from x-toggled to lock the person in for the session
  expect(modifiedResponse.headers['set-cookie'][0].value).toMatch(
    /toggle_outro=(true|false); Path=\/;/
  );
});

// This is to make sure we haven't got type errors in our tests because we don't
// have flow here
test('It runs all the current a/b tests without fail', () => {
  const event = copy(testEventRequest);
  const request = event.Records[0].cf.request;
  abTesting.tests.forEach(test => {
    test.shouldRun(request);
    expect(test.range.length).toBe(2);
    expect(typeof test.id).toBe('string');
  });
});
