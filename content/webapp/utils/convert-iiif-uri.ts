// https://iiif.io/api/image/3.0/#21-image-request-uri-syntax
// Image Request URI Syntax
// {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
// Image Information Request URI Syntax
// {scheme}://{server}{/prefix}/{identifier}/info.json
export function convertRequestUriToInfoUri(requestUri: string): string {
  const match =
    requestUri &&
    requestUri.match(
      /^https:\/\/iiif\.wellcomecollection\.org\/image\/([^/]+)/
    );
  if (match && match[0]) {
    return `${match[0]}/info.json`;
  } else {
    return `${requestUri}/info.json`;
  }
}
