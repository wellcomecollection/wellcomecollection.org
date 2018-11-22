'use-strict';
const abTesting = require('./ab_testing');
const redirector = require('./redirector').redirector;

exports.request = (event, context, callback) => {
  // If we have a redirect, don't bother moving on
  const redirectedResponse = redirector(event, context);
  if (redirectedResponse) {
    callback(null, redirectedResponse);
    return;
  }

  const abTestedRequest = abTesting.request(event, context);

  callback(null, abTestedRequest);
};

exports.response = (event, context, callback) => {
  abTesting.response(event, context);
  const response = event.Records[0].cf.response;

  callback(null, response);
};
