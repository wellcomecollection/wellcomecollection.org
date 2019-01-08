'use-strict';
const querystring = require('querystring');

function createRedirect(location, excludeDomain) {
  return {
    status: '301',
    statusDescription: 'Found',
    headers: {
      location: [{
        key: 'Location',
        value: excludeDomain ? location : `https://wellcomecollection.org${location}`
      }],
      'x-powered-by': [{
        key: 'x-powered-by',
        value: '@weco/wiRedirector'
      }]
    }
  };
}

exports.wiRedirector = (event, context) => {
  const cf = event.Records[0].cf;
  const request = cf.request;

  // Quite cautious on the check just incase we don't get anything through
  if (
    request.headers.host &&
    request.headers.host[0] &&
    request.headers.host[0].value === 'wellcomeimages.org'
  ) {
    // This is for images that we're serving from wellcomelibrary.org
    if (request.querystring && request.uri.match('/ixbin/imageserv')) {
      const params = querystring.parse(request.querystring);

      // e.g. http://wellcomeimages.org/ixbin/imageserv?MIRO=L0054052
      if (params.MIRO) {
        const redirect = createRedirect(
          `https://iiif.wellcomecollection.org/image/${params.MIRO}.jpg/full/125,/0/default.jpg`,
          true
        );
        cf.response = redirect;
        return;
      }

      // e.g. http://wellcomeimages.org/ixbin/hixclient.exe?MIROPAC=V0042017
      if (params.MIROPAC) {
        const redirect = createRedirect(
          `/works?query=${params.MIROPAC}&wellcomeImagesUrl=${request.uri}`
        );
        cf.response = redirect;
      }
    }
  }
};
