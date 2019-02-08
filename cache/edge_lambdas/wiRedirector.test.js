// TODO: Flow comment doc

const wiRedirector = require('./wiRedirector').wiRedirector;
const redirectTestRequestEvent = {
  'Records': [
    {
      'cf': {
        'config': {
          'distributionId': 'EXAMPLE'
        },
        'request': {
          'uri': '/ixbin/imageserv',
          'querystring': 'MIRO=L0054052',
          'method': 'GET',
          'headers': {
            'host': [
              {
                'key': 'Host',
                'value': 'wellcomeimages.org'
              }
            ]
          }
        }
      }
    }
  ]
};
const nonRedirectTestRequestEvent = {
  'Records': [
    {
      'cf': {
        'config': {
          'distributionId': 'EXAMPLE'
        },
        'request': {
          'uri': '/visit-us/',
          'method': 'GET',
          'headers': {
            'host': [
              {
                'key': 'Host',
                'value': 'wellcomecollection.org'
              }
            ]
          }
        }
      }
    }
  ]
};

test('wiRedirector', () => {
  // Should have been redirected
  const redirectedCallback = jest.fn((_, request) => request);
  wiRedirector(redirectTestRequestEvent, {}, redirectedCallback);
  const redirectedResponse = redirectTestRequestEvent.Records[0].cf.response;

  expect(redirectedResponse.headers.location[0]).toEqual({
    key: 'Location',
    value: `https://iiif.wellcomecollection.org/image/L0054052.jpg/full/125,/0/default.jpg`
  });

  // Shouldn't have been redirected, and return the same request
  const nonRedirectedCallback = jest.fn((_, request) => request);
  wiRedirector(nonRedirectTestRequestEvent, {}, nonRedirectedCallback);
  const nonRedirectedResponse = nonRedirectTestRequestEvent.Records[0].cf.response;
  const modifiedRequest = nonRedirectTestRequestEvent.Records[0].cf.request;
  expect(nonRedirectedResponse).toBeUndefined();
  expect(modifiedRequest).toEqual(nonRedirectTestRequestEvent.Records[0].cf.request);
});
