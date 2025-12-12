import { format as formatUrl, parse } from 'url';

// This function redacts query parameters in URLs, so we have a URL that's
// safe to log.  For example, we might get a log including:
//
//      /account/registration?session_token=eyJhbGciOi...{some sort of jwt}
//
// where the JWT could be decoded to reveal personal information including
// email address and IP address.
//
// This function will replace the URL with:
//
//      /account/registration?session_token=[redacted]
//
// It is deliberately un-picky about what it redacts, because we'd rather
// remove something innocent (e.g. ?refresh=true) than miss something sensitive.
export const redactUrl = (url: string): string => {
  // Note: we use a deprecated API here because we're working with
  // relative URLs, e.g. `/account`.
  //
  // The WHATWG URL API that the deprecation message suggests doesn't
  // work for this use case; it wants absolute URLs.
  const parsedUrl = parse(url);

  // If there are no query parameters to redact, we don't need to do anything.
  if (parsedUrl.query === null) {
    return url;
  }

  const params = new URLSearchParams(parsedUrl.query);

  for (const key of params.keys()) {
    params.set(key, '[redacted]');
  }

  parsedUrl.query = params.toString();
  parsedUrl.search = `?${params.toString()}`;

  // When the square brackets get URL-encoded, they're replaced with
  // percent characters, e.g. `/account?token=%5Bredacted%5D`.
  //
  // Because they aren't actually URL characters, we put back the
  // original brackets for ease of readability.
  return formatUrl(parsedUrl).replace(/%5Bredacted%5D/g, '[redacted]');
};
