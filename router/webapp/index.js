'use strict';

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  console.log(`Request: "${request}"`);
  console.log(`Headers: "${headers}"`);
  callback(null, request);
};
