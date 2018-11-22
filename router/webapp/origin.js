'use-strict';
const abTesting = require('./ab_testing');
const redirector = require('./redirector').redirector;

exports.request = (event, context, callback) => {
  // If a response is attached to the Record return it
  redirector(event, context);

  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;
  if (response) {
    callback(null, response);
    return;
  }

  abTesting.request(event, context);
  callback(null, request);
};

exports.response = (event, context, callback) => {
  const response = event.Records[0].cf.response;

  abTesting.response(event, context);
  callback(null, response);
};
