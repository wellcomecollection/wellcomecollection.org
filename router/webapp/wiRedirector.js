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
      // e.g. http://wellcomeimages.org/ixbin/imageserv?MIRO=L0054052
      const params = querystring.parse(request.querystring);
      if (params.MIRO) {
        const redirect = createRedirect(
          `https://iiif.wellcomecollection.org/image/${params.MIRO}.jpg/full/125,/0/default.jpg`,
          true
        );
        cf.response = redirect;
        return;
      }
    }

    if (request.querystring && request.uri.match('/ixbin/hixclient.exe')) {
      // e.g. http://wellcomeimages.org/ixbin/hixclient.exe?MIROPAC=V0042017
      const params = querystring.parse(request.querystring);
      if (params.MIROPAC) {
        const redirect = createRedirect(
          `/works?query=${params.MIROPAC}&wellcomeImagesUrl=${request.uri}`
        );
        cf.response = redirect;
        return;
      }
    }

    // e.g. http://wellcomeimages.org/indexplus/image/hats.html
    const searchTermMatch = request.uri.match(/\/indexplus\/image\/(.*)\.html/i);
    if (searchTermMatch) {
      const redirect = createRedirect(
        `/works?query=${searchTermMatch[1]}&wellcomeImagesUrl=${request.uri}`
      );
      cf.response = redirect;
      return;
    }

    // e.g. http://wellcomeimages.org/indexplus/gallery/AIDS posters.html
    const galleryMatch = request.uri.match(/\/indexplus\/gallery\/(.*)\.html/i);
    if (galleryMatch) {
      const redirect = createRedirect(
        `/works?query=${galleryMatch[1]}&wellcomeImagesUrl=${request.uri}`
      );
      cf.response = redirect;
      return;
    }

    if (!cf.response) {
      const redirect = createRedirect(
        `/works?wellcomeImagesUrl=${request.uri}`
      );
      cf.response = redirect;
    }
  }
};
