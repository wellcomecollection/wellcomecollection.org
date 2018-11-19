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
let tests = [];
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

exports.request = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const toggleCookies = parseToggleCookies(request.headers.cookie);

  const newToggles = tests.map(test => {
    // Isn't already set
    const isSet = Boolean(toggleCookies.find(cookie => cookie.key === `toggle_${test.id}`));
    if (test.shouldRun(request) && !isSet) {
      // Flip the dice
      if (Math.random() < 0.5) {
        return { key: `toggle_${test.id}`, value: true };
      } else {
        return { key: `toggle_${test.id}`, value: false };
      }
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

  console.log('Request: goodbye');
  callback(null, request);
};

exports.response = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;

  console.log('Response: trying to set set-cookie header');
  const toggleCookies = parseToggleCookies(request.headers['x-toggled']);

  if (toggleCookies.length > 0) {
    console.log('Response: setting set-cookie header');
    response.headers[`set-cookie`] = toggleCookies.map(cookie => ({ key: 'Set-Cookie', value: `${cookie.key}=${cookie.value}; Path=/;` }));
  }

  console.log('Response: goodbye');
  callback(null, response);
};
