// TODO: Flow comment doc

const redirector = require('./redirector').redirector;
const redirectTestRequestEvent = {
  'Records': [
    {
      'cf': {
        'config': {
          'distributionId': 'EXAMPLE'
        },
        'request': {
          'uri': '/visit-us/wellcome-café',
          'method': 'GET',
          'clientIp': '2001:cdba::3257:9652'
        }
      }
    }
  ]
};
const nonRedirectTestRequest = {
  'Records': [
    {
      'cf': {
        'config': {
          'distributionId': 'EXAMPLE'
        },
        'request': {
          'uri': '/visit-us',
          'method': 'GET',
          'clientIp': '2001:cdba::3257:9652'
        }
      }
    }
  ]
};

test('redirector', () => {
  // Should have been redirected
  const redirectedCallback = jest.fn((_, request) => request);
  const response = redirector(redirectTestRequestEvent, {}, redirectedCallback);
  expect(response.headers.location[0]).toEqual({
    key: 'Location',
    value: `https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe`
  });

  // Shouldn't have been redirected, and return the same request
  const nonRedirectedCallback = jest.fn((_, request) => request);
  const nonRedirectedResponse = redirector(nonRedirectTestRequest, {}, nonRedirectedCallback);
  const modifiedRequest = nonRedirectTestRequest.Records[0].cf.request;
  expect(nonRedirectedResponse).toBeUndefined();
  expect(modifiedRequest).toEqual(nonRedirectTestRequest.Records[0].cf.request);
});
