import { getRedirect } from './redirector';
import { CloudFrontRequestEvent } from 'aws-lambda';

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
  const redirectedResponse = getRedirect(
    redirectTestRequestEvent as CloudFrontRequestEvent
  );

  expect(redirectedResponse?.headers.location[0]).toEqual({
    key: 'Location',
    value: `https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe`,
  });

  // Shouldn't have been redirected, and return the same request
  const nonRedirectedResponse = getRedirect(
    nonRedirectTestRequestEvent as CloudFrontRequestEvent
  );
  const modifiedRequest = nonRedirectTestRequestEvent.Records[0].cf.request;
  expect(nonRedirectedResponse).toBeUndefined();
  expect(modifiedRequest).toEqual(
    nonRedirectTestRequestEvent.Records[0].cf.request
  );
});
