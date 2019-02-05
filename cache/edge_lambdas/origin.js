'use-strict';
const abTesting = require('./toggler');
const redirector = require('./redirector').redirector;
const wiRedirector = require('./wiRedirector').wiRedirector;

exports.request = (event, context, callback) => {
  redirector(event, context);
  wiRedirector(event, context);

  // If we've attached a response, send it through straight away
  const response = event.Records[0].cf.response;
  if (response) {
    callback(null, response);
    return;
  }

  const request = event.Records[0].cf.request;
  abTesting.request(event, context);
  callback(null, request);
};

exports.response = (event, context, callback) => {
  const response = event.Records[0].cf.response;

  abTesting.response(event, context);
  callback(null, response);
};
