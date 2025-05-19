import {
  CloudFrontHeaders,
  CloudFrontRequest,
  CloudFrontRequestEvent,
  CloudFrontResponseEvent,
} from 'aws-lambda';

type Test = {
  id: string;
  title: string;
  // Traffic included in the test is always split 50/50, the range specifies the percentage of total traffic to include in the test
  // range: [0, 50], // Run this test on 50% of users
  // range: [50, 100], // Run this test on 50% of users - not overlapping with ☝️
  range: [number, number];
  // Use the when property with caution, especially when journeys are using client side routing
  // Need to ensure that all the possible endpoints a user can hit, will set the cookie
  // when: (request) => {
  //   return request.uri.match(/^\/articles\/*/);
  // }
  when: (request: CloudFrontRequest) => boolean;
};

// This is mutable for testing
export let tests: Test[] = [
  {
    id: 'abTestTestTest',
    title: 'Testing the A/B test toggler',
    range: [0, 100],
    when: request => {
      return !!request.uri.match(/\/works\/.*$/);
    },
  },
];

export const setTests = function (newTests: Test[]): void {
  tests = newTests;
};

// Taken from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-redirect-to-signin-page
function parseToggleCookies(
  cookieHeader: CloudFrontHeaders[keyof CloudFrontHeaders]
) {
  return cookieHeader && cookieHeader[0]
    ? cookieHeader[0].value
        .split(';')
        .map(cookie => {
          if (cookie) {
            const parts = cookie.split('=');
            const key = parts[0].trim();
            const value = parts[1].trim();
            if (key.match('toggle_')) {
              return { key, value };
            }
          }
          return false;
        })
        .filter((x): x is { key: string; value: string } => Boolean(x))
    : [];
}

function randomFromRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// There are multiple conditions as to whether someone should be in a test
// 1. They are not already in the test - if so, maintain their state
// 2. Once given a random point between 0/100, we see if this falls within the specified range
// 3. Any custom conditions are met in the test.when method
function shouldRun(test: Test, request: CloudFrontRequest) {
  const toggleCookies = parseToggleCookies(request.headers.cookie);
  const isAlreadyInTest = Boolean(
    toggleCookies.find(cookie => cookie.key === `toggle_${test.id}`)
  );

  const point = randomFromRange(0, 99);
  const [from, to] = test.range;
  const inRange = point >= from && point < to;

  return !isAlreadyInTest && inRange && test.when(request);
}

export const request = (event: CloudFrontRequestEvent): void => {
  const request = event.Records[0].cf.request;

  const newToggles = tests
    .map(test => {
      try {
        if (shouldRun(test, request)) {
          // Roll the dice
          const val = Math.random() >= 0.5;
          return { key: `toggle_${test.id}`, value: val };
        }
        return false;
      } catch (error) {
        console.log(
          `Toggles request: a/b test when() broke with error:`,
          (error as Error).message
        );

        if (process.env.NODE_ENV === 'test') {
          throw error;
        }
        return false;
      }
    })
    .filter((x): x is { key: string; value: boolean } => Boolean(x));

  if (newToggles.length > 0) {
    // We can technically send multiple Cookie headers down the pipes, but not
    // sure I want to be messing with that just yet
    const togglesCookieString = newToggles
      .map(cookie => `${cookie.key}=${cookie.value}`)
      .join(';');

    const newCookieHeader = [
      {
        key: 'Cookie',
        value:
          request.headers.cookie && request.headers.cookie[0]
            ? request.headers.cookie[0].value + '; ' + togglesCookieString
            : togglesCookieString,
      },
    ];

    request.headers.cookie = newCookieHeader;

    // To be read by the response
    request.headers['x-toggled'] = [
      {
        key: 'X-toggled',
        value: togglesCookieString,
      },
    ];
  }
};

export const response = (event: CloudFrontResponseEvent): void => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;

  const toggleCookies = parseToggleCookies(request.headers['x-toggled']);

  if (toggleCookies.length > 0) {
    response.headers['set-cookie'] = toggleCookies.map(cookie => ({
      key: 'Set-Cookie',
      value: `${cookie.key}=${cookie.value}; Path=/;`,
    }));
  }
};
