'use strict';

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
function parseCookies(headers) {
  const parsedCookie = {};
  if (headers.cookie) {
    headers.cookie[0].value.split(';').forEach((cookie) => {
      if (cookie) {
        const parts = cookie.split('=');
        parsedCookie[parts[0].trim()] = parts[1].trim();
      }
    });
  }
  return parsedCookie;
}

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;
  const headers = request.headers;
  const cookies = parseCookies(headers);

  let prevToggles = {};
  let newToggles = {};
  try {
    prevToggles = JSON.parse(cookies.toggles);
  } catch (e) {}

  // Run outro test
  // Should run, and isn't already set
  if (request.uri.match(/^\/articles\/*/) && !('outro' in prevToggles)) {
    // Flip the dice
    if (Math.random() < 0.5) {
      newToggles.outro = true;
    } else {
      newToggles.outro = false;
    }
  }
  // End bespoke tests

  if (Object.keys(newToggles).length > 0) {
    const toggles = Object.assign({}, prevToggles, newToggles);
    response.headers['set-cookie'] = [{ key: 'Set-Cookie', value: `toggles=${JSON.stringify(toggles)}; Path=/;` }];
  }

  callback(null, response);
};
