'use-strict';
const redirects = require('./redirects.json');

exports.redirector = (event, context) => {
  const cf = event.Records[0].cf;
  const request = cf.request;
  const uriSansSlash = request.uri.replace(/\/$/, '');
  if (redirects[uriSansSlash]) {
    const response = {
      status: '301',
      statusDescription: 'Found',
      headers: {
        location: [{
          key: 'Location',
          value: `https://wellcomecollection.org${redirects[uriSansSlash]}`
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
