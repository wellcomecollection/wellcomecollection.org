// Lets Prismic previews through and sends everything else (mostly crawlers)
// to the same path on the main site.
const prismicOrigin = 'https://wellcomecollection.prismic.io';
const mainSite = 'https://wellcomecollection.org';

function headerValue(request, name) {
  const header = request.headers[name];
  return header ? header.value : undefined;
}

function isPreviewRequest(request) {
  // Prismic's entry point for editor previews
  if (request.uri === '/preview') return true;

  // Set by the Prismic toolbar once a preview session has started
  if (request.cookies['io.prismic.preview']) return true;

  // First page load of an editor preview or a share link, before the cookie exists
  const referer = headerValue(request, 'referer');
  if (
    referer &&
    (referer === prismicOrigin || referer.startsWith(`${prismicOrigin}/`))
  ) {
    return true;
  }

  // Scripts and fetches made by that first page; a direct hit is 'none' or absent
  const fetchMode = headerValue(request, 'sec-fetch-mode');
  const fetchSite = headerValue(request, 'sec-fetch-site');
  if (fetchMode && fetchMode !== 'navigate' && fetchSite === 'same-origin') {
    return true;
  }

  return false;
}

function queryString(querystring) {
  const parts = [];
  Object.keys(querystring).forEach(key => {
    const param = querystring[key];
    const values = param.multiValue
      ? param.multiValue.map(v => v.value)
      : [param.value];
    values.forEach(value => {
      parts.push(`${key}=${value}`);
    });
  });
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

// eslint-disable-next-line no-unused-vars
function handler(event) {
  const request = event.request;

  if (isPreviewRequest(request)) return request;

  return {
    statusCode: 302,
    statusDescription: 'Found',
    headers: {
      location: {
        value: mainSite + request.uri + queryString(request.querystring),
      },
    },
  };
}
