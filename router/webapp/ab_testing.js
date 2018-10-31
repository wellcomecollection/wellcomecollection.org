'use strict';
// TODO: Flow comment doc
// Potential format for a test
// const outroTest = {
//   segments: {
//     a: [0, 0.5],
//     b: [0.5, 1]
//   },
//   canRun: function(request, headers) {
//     return request.uri.match(/^\/articles\/*/);
//   }
// };

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
  const newToggles = [];

  // Run outro test
  // Should run, and isn't already set
  const hasOutro = Boolean(toggleCookies.find(cookie => cookie.key === 'toggle_outro'));
  if (request.uri.match(/^\/articles\/*/) && !hasOutro) {
    console.log('Request: Setting outro toggle');
    // Flip the dice
    if (Math.random() < 0.5) {
      newToggles.push({ key: 'toggle_outro', value: true });
    } else {
      newToggles.push({ key: 'toggle_outro', value: false });
    }
  }
  // End bespoke tests

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
