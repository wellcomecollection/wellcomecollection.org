// TODO: Flow comment doc

const redirector = require('./redirector').redirector;
const redirectTestRequestEvent = {
  Records: [
    {
      cf: {
        config: {
          distributionId: 'EXAMPLE',
        },
        request: {
          uri: '/visit-us/wellcome-café/',
          method: 'GET',
          clientIp: '2001:cdba::3257:9652',
        },
      },
    },
  ],
};
const nonRedirectTestRequestEvent = {
  Records: [
    {
      cf: {
        config: {
          distributionId: 'EXAMPLE',
        },
        request: {
          uri: '/visit-us/',
          method: 'GET',
          clientIp: '2001:cdba::3257:9652',
        },
      },
    },
  ],
};

test('redirector', () => {
  // Should have been redirected
  const redirectedCallback = jest.fn((_, request) => request);
  redirector(redirectTestRequestEvent, {}, redirectedCallback);
  const redirectedResponse = redirectTestRequestEvent.Records[0].cf.response;

  expect(redirectedResponse.headers.location[0]).toEqual({
    key: 'Location',
    value: `https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe`,
  });

  // Shouldn't have been redirected, and return the same request
  const nonRedirectedCallback = jest.fn((_, request) => request);
  redirector(nonRedirectTestRequestEvent, {}, nonRedirectedCallback);
  const nonRedirectedResponse =
    nonRedirectTestRequestEvent.Records[0].cf.response;
  const modifiedRequest = nonRedirectTestRequestEvent.Records[0].cf.request;
  expect(nonRedirectedResponse).toBeUndefined();
  expect(modifiedRequest).toEqual(
    nonRedirectTestRequestEvent.Records[0].cf.request
  );
});
