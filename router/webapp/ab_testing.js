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
function parseCookies(cookieHeader) {
  const parsedCookie = {};
  if (cookieHeader[0]) {
    cookieHeader[0].value.split(';').forEach((cookie) => {
      if (cookie) {
        const parts = cookie.split('=');
        parsedCookie[parts[0].trim()] = parts[1].trim();
      }
    });
  }
  return parsedCookie;
}

exports.request = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const cookieHeader = request.headers.cookie || [];
  const cookies = parseCookies(cookieHeader);

  let prevToggles = {};
  let newToggles = {};
  try {
    prevToggles = JSON.parse(cookies.toggles);
  } catch (e) {}

  // Run outro test
  // Should run, and isn't already set
  if (request.uri.match(/^\/articles\/*/) && !('outro' in prevToggles)) {
    console.log('Request: Setting outro toggle');
    // Flip the dice
    if (Math.random() < 0.5) {
      newToggles.outro = true;
    } else {
      newToggles.outro = false;
    }
  }
  // End bespoke tests

  if (Object.keys(newToggles).length > 0) {
    console.log('Request: Setting toggled header and cookies');
    const toggles = Object.assign({}, prevToggles, newToggles);
    const togglesCookie = `toggles=${JSON.stringify(toggles)}; Path=/;`;
    // TODO: This doens't take into account any other cookie
    // But we also don't set any other cookies
    const newCookieHeader = [{
      key: 'Cookie',
      value: togglesCookie
    }];
    request.headers.cookie = newCookieHeader;
    // To be read by the response
    request.headers['x-toggled'] = [{
      key: 'X-toggled',
      value: 'true'
    }];
  }

  console.log('Request: goodbye');
  callback(null, request);
};

exports.response = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;

  if (request.headers['x-toggled']) {
    console.log('Response: trying to set set-cookie header');
    const cookieHeader = request.headers.cookie || [];
    const cookies = parseCookies(cookieHeader);
    let toggles = {};
    try {
      toggles = JSON.parse(cookies.toggles);
    } catch (e) {}

    if (Object.keys(toggles).length > 0) {
      console.log('Response: setting set-cookie header');
      response.headers['set-cookie'] = [{ key: 'Set-Cookie', value: `toggles=${JSON.stringify(toggles)}; Path=/;` }];
    }
  }

  console.log('Response: goodbye');
  callback(null, response);
};
