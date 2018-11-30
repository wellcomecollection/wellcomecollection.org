'use-strict';
const redirects = require('./redirects.json');

exports.redirector = (event, context) => {
  const cf = event.Records[0].cf;
  const request = cf.request;
  if (redirects[request.uri.replace(/\/$/, '')]) {
    const response = {
      status: '301',
      statusDescription: 'Found',
      headers: {
        location: [{
          key: 'Location',
          value: `https://wellcomecollection.org${redirects[request.uri]}`
        }],
        'x-powered-by': [{
          key: 'x-powered-by',
          value: '@weco/redirector'
        }]
      }
    };
    cf.response = response;
  }
};
