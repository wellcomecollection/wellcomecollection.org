'use strict';
// TODO: Flow comment doc
// test type
// {
//   id: 'outro',
//   title: 'Outro',
//   range: [0, 50], // Run this test on 50% of users
//   range: [50, 100], // Run this test on 50% of users - not overlapping with ☝️
//   when: (request, range) => {
//     return request.uri.match(/^\/articles\/*/);
//   }
// }

// This is mutable for testing
let tests = [
  {
    id: 'searchFixedFields',
    title:
      'Fix a glitch in the scoring tiers, and see if it makes things better for people',
    range: [0, 100],
    when: (request, range) => {
      return request.uri.match(/^\/works\/*/);
    },
  },
  {
    id: 'altNewsletterSignupCopy',
    title: 'Alternative NewsletterPromo copy',
    range: [0, 100],
    when: request => {
      return !request.uri.match(/\/works\/.+/); // promo not on 'works/{id}' or 'works/{id}/items...'
    },
  },
];
exports.tests = tests;
exports.setTests = function(newTests) {
  tests = newTests;
};

// Taken from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-redirect-to-signin-page
function parseToggleCookies(cookieHeader) {
  const cookies =
    cookieHeader && cookieHeader[0]
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
          })
          .filter(Boolean)
      : [];
  return cookies;
}

function randomFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// There are multiple conditions as to whether someone should be in a test
// 1. They are not already in the test - if so, maintain their state
// 2. Once given a random point between 0/100, we see if this falls within the specified range
// 3. Any custom conditions are met in the test.when method
function shouldRun(test, request) {
  const toggleCookies = parseToggleCookies(request.headers.cookie);
  const isAlreadyInTest = Boolean(
    toggleCookies.find(cookie => cookie.key === `toggle_${test.id}`)
  );

  const point = randomFromRange(0, 99);
  const [from, to] = test.range;
  const inRange = point >= from && point < to;

  return !isAlreadyInTest && inRange && test.when(request);
}

exports.request = (event, context) => {
  const request = event.Records[0].cf.request;

  const newToggles = tests
    .map(test => {
      // Isn't already set

      try {
        if (shouldRun(test, request)) {
          // Roll the dice
          const val = Math.random() >= 0.5;
          return { key: `toggle_${test.id}`, value: val };
        }
      } catch (error) {
        console.log(
          `Toggles request: a/b test when() broke with error:`,
          error.message
        );

        if (process.env.NODE_ENV === 'test') {
          throw error;
        }
      }
    })
    .filter(Boolean);

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

exports.response = (event, context) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;

  const toggleCookies = parseToggleCookies(request.headers['x-toggled']);

  if (toggleCookies.length > 0) {
    response.headers[`set-cookie`] = toggleCookies.map(cookie => ({
      key: 'Set-Cookie',
      value: `${cookie.key}=${cookie.value}; Path=/;`,
    }));
  }
};
