const redirects = require('./redirects.json');

exports.redirector = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  if (redirects[request.uri]) {
    const response = {
      status: '301',
      statusDescription: 'Found',
      headers: {
        location: [{
          key: 'Location',
          value: `https://wellcomecollection.org${redirects[request.uri]}`
        }]
      }
    };
    callback(null, response);
  } else {
    callback(null, request);
  }
};
