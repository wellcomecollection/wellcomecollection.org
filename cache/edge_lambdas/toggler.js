'use strict';
// TODO: Flow comment doc
// test type
// {
//   id: 'outro',
//   title: 'Outro',
//   range: [0, 50] // 50% chance, this is [inclusive, exclusive)
//   range: [50, 100] // 50% chance, this is [inclusive, exclusive)
//   shouldRun: (request, range) => {
//     return request.uri.match(/^\/articles\/*/);
//   }
// }

// This is mutable for testing
let tests = [
  {
    id: 'search_cadidate_query_msm',
    title: 'Search candidate query: Minimum should match',
    range: [0, 10],
    shouldRun: request => {
      return request.uri.match(/^\/works\/*/);
    },
  },
  {
    id: 'search_cadidate_query_boost',
    title: 'Search candidate query: Minimum should match',
    range: [10, 20],
    shouldRun: request => {
      return request.uri.match(/^\/works\/*/);
    },
  },
  {
    id: 'search_cadidate_query_msmboost',
    title: 'Search candidate query: Minimum should match',
    range: [20, 30],
    shouldRun: request => {
      return request.uri.match(/^\/works\/*/);
    },
  },
];

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

exports.request = (event, context) => {
  const request = event.Records[0].cf.request;
  const toggleCookies = parseToggleCookies(request.headers.cookie);

  const newToggles = tests
    .map(test => {
      // Isn't already set
      const isSet = Boolean(
        toggleCookies.find(cookie => cookie.key === `toggle_${test.id}`)
      );
      try {
        if (test.shouldRun(request) && !isSet) {
          // Flip the dice
          const point = randomFromRange(0, 99);
          const [from, to] = test.range;
          const inRange = point >= from && point < to;

          if (inRange) {
            return { key: `toggle_${test.id}`, value: true };
          } else {
            return { key: `toggle_${test.id}`, value: false };
          }
        }
      } catch (error) {
        console.log(
          `Toggles request: a/b test shouldRun() broke with error: ${error}`
        );
      }
    })
    .filter(Boolean);

  if (newToggles.length > 0) {
    // We can technically send multiple Cookie headers down the pipes, but not
    // sure I want to be messing with that just yet
    console.log('Toggles request: Setting toggled header and cookies');
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

  console.log('Toggles response: trying to set set-cookie header');
  const toggleCookies = parseToggleCookies(request.headers['x-toggled']);

  if (toggleCookies.length > 0) {
    console.log('Toggles response: setting set-cookie header');
    response.headers[`set-cookie`] = toggleCookies.map(cookie => ({
      key: 'Set-Cookie',
      value: `${cookie.key}=${cookie.value}; Path=/;`,
    }));
  }
};
