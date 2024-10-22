import { CloudFrontHeaders, CloudFrontRequestEvent } from 'aws-lambda';

import { getRedirect } from './redirector';

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
    value: `https://wellcomecollection.org/pages/cafe`,
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
    value: `https://www-stage.wellcomecollection.org/pages/cafe`,
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
      description:
        'Image search within works should redirect to Image search hub page',
      from: '/works?search=images',
      to: '/search/images',
    },
    {
      description:
        'Image search within works should redirect to Image search hub page and change the legacy param key',
      from: '/works?search=images&images.color=red', // Test legacy color param
      to: '/search/images?color=red',
    },
    {
      description:
        'Works should redirect to Catalogue search hub page, with specified forwardParams§',
      from: '/works?query=beep&workType=v&beep=boop',
      to: '/search/works?query=beep&workType=v',
    },
    {
      description:
        'Image should redirect to Image search hub page, with specified forwardParams§',
      from: '/images?color=blue&hello=world',
      to: '/search/images?color=blue',
    },
    // Extra testing cases
    {
      description: 'Only forward the specified forwardParams',
      from: '/images?beep=boop',
      to: '/search/images',
    },
    {
      description: 'partOf.title is kept as a query param',
      from: '/works?partOf.title=Eighteenth+Century+collections+online',
      to: '/search/works?partOf.title=Eighteenth+Century+collections+online',
    },
    {
      description: 'Do not occur if the uri is not an exact match',
      from: '/work',
      to: 'redirectionShouldFail',
    },
    {
      description: 'Do not occur if the uri is not an exact match',
      from: '/test?query=beep',
      to: 'redirectionShouldFail',
    },
    {
      description: 'Do not occur if the uri is not an exact match',
      from: '/test/works',
      to: 'redirectionShouldFail',
    },
  ])(`$description`, ({ from, to }) => {
    const origin = 'https://wellcomecollection.org';

    const fromUrl = new URL(origin + from);
    fromUrl.searchParams.sort(); // strictly, we're not testing whether it maintains query string order
    const fromRequestObject = {
      uri: fromUrl.pathname,
      querystring: fromUrl.searchParams.toString(),
    };

    const redirectedResponse = getRedirect(request(fromRequestObject));

    if (to === 'redirectionShouldFail') {
      expect(redirectedResponse).toBeUndefined();
    } else {
      const redirectLocationUrl = new URL(
        redirectedResponse?.headers.location[0]?.value || ''
      );
      redirectLocationUrl.searchParams.sort(); // as above

      const toUrl = new URL(origin + to);
      toUrl.searchParams.sort();

      expect(redirectedResponse?.status).toEqual('301');
      expect(redirectLocationUrl.pathname).toEqual(toUrl.pathname);
      expect(redirectLocationUrl.searchParams.toString()).toEqual(
        toUrl.searchParams.toString()
      );
    }
  });
});
