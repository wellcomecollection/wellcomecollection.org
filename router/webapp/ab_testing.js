'use strict';
// TODO: Flow comment doc
// test type
// {
//   id: 'outro',
//   title: 'Outro',
//   shouldRun: (request) => {
//     return request.uri.match(/^\/articles\/*/);
//   }
// }

// This is mutable for testing
let tests = [
  {
    id: 'showSingleColumnWork',
    title: 'Show work metadata in a single column',
    shouldRun(request) {
      return request.url.match(/^\/works\/.+/);
    }
  }
];

exports.setTests = function(newTests) {
  tests = newTests;
};

// Taken from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-redirect-to-signin-page
function parseToggleCookies(cookieHeader) {
  const cookies = cookieHeader && cookieHeader[0] ? cookieHeader[0].value.split(';').map(cookie => {
    if (cookie) {
      const parts = cookie.split('=');
      const key = parts[0].trim();
      const value = parts[1].trim();
      if (key.match('toggle_')) {
        return {key, value};
      }
    }
  }).filter(Boolean) : [];
  return cookies;
}

exports.request = (event, context) => {
  const request = event.Records[0].cf.request;
  const toggleCookies = parseToggleCookies(request.headers.cookie);

  const newToggles = tests.map(test => {
    // Isn't already set
    const isSet = Boolean(toggleCookies.find(cookie => cookie.key === `toggle_${test.id}`));
    try {
      if (test.shouldRun(request) && !isSet) {
        // Flip the dice
        if (Math.random() < 0.5) {
          return { key: `toggle_${test.id}`, value: true };
        } else {
          return { key: `toggle_${test.id}`, value: false };
        }
      }
    } catch (error) {
      console.log(`a/b test shouldRun() broke with error: ${error}`);
    }
  }).filter(Boolean);

  if (newToggles.length > 0) {
    // We can technically send multiple Cookie headers down the pipes, but not
    // sure I want to be messing with that just yet
    console.log('Request: Setting toggled header and cookies');
    const togglesCookieString = newToggles.map(cookie => `${cookie.key}=${cookie.value}`).join(';');
    const newCookieHeader = [{
      key: 'Cookie',
      value: request.headers.cookie && request.headers.cookie[0]
        ? request.headers.cookie[0].value + '; ' + togglesCookieString
        : togglesCookieString
    }];
    request.headers.cookie = newCookieHeader;
    // To be read by the response
    request.headers['x-toggled'] = [{
      key: 'X-toggled',
      value: togglesCookieString
    }];
  }
};

exports.response = (event, context) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;

  console.log('Response: trying to set set-cookie header');
  const toggleCookies = parseToggleCookies(request.headers['x-toggled']);

  if (toggleCookies.length > 0) {
    console.log('Response: setting set-cookie header');
    response.headers[`set-cookie`] = toggleCookies.map(cookie => ({ key: 'Set-Cookie', value: `${cookie.key}=${cookie.value}; Path=/;` }));
  }
};
