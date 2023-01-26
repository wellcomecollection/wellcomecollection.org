import { getRedirect } from './redirector';
import { CloudFrontHeaders, CloudFrontRequestEvent } from 'aws-lambda';

const request = ({
  uri,
  querystring,
  headers,
}: {
  uri: string;
  querystring?: string;
  headers?: CloudFrontHeaders;
}): CloudFrontRequestEvent => ({
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
          headers: headers || {},
        },
      },
    },
  ],
});

test('It returns 301 responses for URLs with defined redirects', () => {
  // Should have been redirected
  const redirectedResponse = getRedirect(
    request({ uri: '/visit-us/wellcome-café/' })
  );

  expect(redirectedResponse?.status).toEqual('301');
  expect(redirectedResponse?.headers.location[0]).toEqual({
    key: 'Location',
    value: `https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe`,
  });
});

test('It returns nothing for URLs without defined redirects', () => {
  const nonRedirectedResponse = getRedirect(request({ uri: '/visit-us/' }));
  expect(nonRedirectedResponse).toBeUndefined();
});

test('It redirects requests from the staging site to a staging page', () => {
  const redirectedResponse = getRedirect(
    request({
      uri: '/visit-us/wellcome-café/',
      headers: {
        host: [{ key: 'Host', value: 'www-stage.wellcomecollection.org' }],
      },
    })
  );

  expect(redirectedResponse?.headers.location[0]).toEqual({
    key: 'Location',
    value: `https://www-stage.wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe`,
  });
});

// We need to add some extra query redirects to test all of the desired behaviour
jest.mock('./redirects', () => {
  const defaultRedirects = jest.requireActual('./redirects');
  return {
    ...defaultRedirects,
    queryRedirects: {
      ...defaultRedirects.queryRedirects,
      '/test': [
        {
          matchParams: new URLSearchParams({
            beep: 'boop',
            bing: 'bong',
            fizz: 'buzz',
          }),
          forwardParams: new Set(),
          redirectPath: '/test-destination',
        },
      ],
    },
  };
});

describe('Query string redirects', () => {
  test.each([
    // Offically active cases
    // listed in redirect.ts rules
    // as we can't have them work locally, we test them here
    {
      testFunction:
        'Image search within works should redirect to Image search hub page',
      from: { uri: '/works', querystring: 'search=images' },
      to: 'https://wellcomecollection.org/search/images',
    },
    {
      testFunction:
        'Works should redirect to Catalogue search hub page, with specified forwardParams§',
      from: { uri: '/works', querystring: 'query=beep&workType=v&beep=boop' },
      to: 'https://wellcomecollection.org/search/works?query=beep&workType=v',
    },
    {
      testFunction:
        'Image should redirect to Image search hub page, with specified forwardParams§',
      from: { uri: '/images', querystring: 'images.color=blue&hello=world' },
      to: 'https://wellcomecollection.org/search/images?images.color=blue',
    },
    // Extra testing cases
    {
      testFunction: 'Only forward the specified forwardParams',
      from: { uri: '/images', querystring: 'beep=boop' },
      to: 'https://wellcomecollection.org/search/images',
    },
    {
      testFunction: 'Do not occur if the uri is not an exact match',
      from: { uri: '/work' },
      to: 'redirectionShouldFail',
    },
    {
      testFunction: 'Do not occur if the uri is not an exact match',
      from: { uri: '/test', querystring: 'query=beep' },
      to: 'redirectionShouldFail',
    },
    {
      testFunction: 'Do not occur if the uri is not an exact match',
      from: { uri: '' },
      to: 'redirectionShouldFail',
    },
  ])(`$testFunction`, ({ from, to }) => {
    const redirectedResponse = getRedirect(request(from));

    to !== 'redirectionShouldFail'
      ? expect(redirectedResponse?.headers.location[0].value).toEqual(to)
      : expect(redirectedResponse).toBeUndefined();
  });
});
