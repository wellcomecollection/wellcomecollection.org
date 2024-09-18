import testEventRequest from './test_event_request';
import testEventResponse from './test_event_response';
import * as abTesting from './toggler';

function copy(obj: unknown) {
  return JSON.parse(JSON.stringify(obj));
}

test('x-toggled header gets added, and sends the cookie to the client', () => {
  abTesting.setTests([
    {
      id: 'outro',
      title: 'Outro',
      range: [0, 100],
      when: request => {
        return !!request.uri.match(/^\/articles\/*/);
      },
    },
    {
      id: 'wontrun',
      title: `Won't run`,
      range: [0, 100],
      when() {
        return false;
      },
    },
  ]);

  const oldRequest = copy(testEventRequest.Records[0].cf.request);

  abTesting.request(testEventRequest);
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

  abTesting.response(testEventResponse);
  const modifiedResponse = testEventResponse.Records[0].cf.response;

  // 3. set cookie is set from x-toggled to lock the person in for the session
  expect(modifiedResponse.headers['set-cookie'][0].value).toMatch(
    /toggle_outro=(true|false); Path=\/;/
  );
});

test('It runs all the current a/b tests without fail', () => {
  const event = copy(testEventRequest);
  const request = event.Records[0].cf.request;
  abTesting.tests.forEach(test => {
    test.when(request);
    expect(test.range.length).toBe(2);
    expect(typeof test.id).toBe('string');
  });
});
