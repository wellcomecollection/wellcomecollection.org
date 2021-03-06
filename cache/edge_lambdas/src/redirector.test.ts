import { getRedirect } from './redirector';
import { CloudFrontRequestEvent } from 'aws-lambda';

const request = (
  uri: string,
  querystring?: string
): CloudFrontRequestEvent => ({
  Records: [
    {
      cf: {
        config: {
          distributionId: 'EXAMPLE',
          distributionDomainName: '',
          requestId: '',
          eventType: 'origin-request',
        },
        request: {
          uri,
          querystring: querystring || '',
          method: 'GET',
          clientIp: '2001:cdba::3257:9652',
          headers: {},
        },
      },
    },
  ],
});

test('It returns 301 responses for URLs with defined redirects', () => {
  // Should have been redirected
  const redirectedResponse = getRedirect(request('/visit-us/wellcome-café/'));

  expect(redirectedResponse?.status).toEqual('301');
  expect(redirectedResponse?.headers.location[0]).toEqual({
    key: 'Location',
    value: `https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe`,
  });
});

test('It returns nothing for URLs without defined redirects', () => {
  const nonRedirectedResponse = getRedirect(request('/visit-us/'));
  expect(nonRedirectedResponse).toBeUndefined();
});

// We need to add some extra query redirects to test all of the desired behaviour
jest.mock('./redirects', () => {
  const defaultRedirects = jest.requireActual('./redirects');
  return {
    ...defaultRedirects,
    queryRedirects: {
      ...defaultRedirects.queryRedirects,
      '/test': {
        matchParams: new URLSearchParams({
          beep: 'boop',
          bing: 'bong',
          fizz: 'buzz',
        }),
        forwardParams: new Set(),
        redirectPath: '/test-destination',
      },
    },
  };
});

describe('Query string redirects', () => {
  test('Occur when all the params in the definition are in the request', () => {
    const redirectedResponse = getRedirect(request('/works', 'search=images'));

    expect(redirectedResponse?.status).toEqual('301');
    expect(redirectedResponse?.headers.location[0]).toEqual({
      key: 'Location',
      value: 'https://wellcomecollection.org/images',
    });
  });

  test('Do not occur if all of the params in the definition are not matched', () => {
    const nonRedirectedResponse = getRedirect(request('/test', 'bing=bong'));
    expect(nonRedirectedResponse).toBeUndefined();
  });

  test('Only forwards params that are contained within forwardParams', () => {
    const redirectedResponse = getRedirect(
      request('/works', 'search=images&query=beep&something=else')
    );
    expect(redirectedResponse?.status).toEqual('301');
    expect(redirectedResponse?.headers.location[0]).toEqual({
      key: 'Location',
      value: 'https://wellcomecollection.org/images?query=beep',
    });
  });
});
