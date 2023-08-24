export function convertIiifUriToInfoUri(originalUriPath: string): string {
  // Note: this regex assumes that our image identifiers have a three-letter
  // file extension.  This won't always be the case, e.g. Miro images have
  // identifiers like "B0009730".
  //
  // Is this going to be an issue?  Would we be better off counting slashes
  // in the URL?
  const match =
    originalUriPath &&
    originalUriPath.match(
      /^https:\/\/iiif\.wellcomecollection\.org\/image\/(.+?\.[a-z]{3})/
    );
  if (match && match[0]) {
    return `${match[0]}/info.json`;
  } else {
    return `${originalUriPath}/info.json`;
  }
}
