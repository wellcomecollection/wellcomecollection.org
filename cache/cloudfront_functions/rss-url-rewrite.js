// eslint-disable-next-line no-unused-vars
function handler(event) {
  const request = event.request;
  const uri = request.uri;

  if (uri === '/stories') {
    request.uri = '/rss';
    return request;
  } else {
    return {
      statusCode: 404,
    };
  }
}
