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
  let u: URL;
  let isRelative = false;

  try {
    // Try to parse as an absolute URL first
    u = new URL(url);
  } catch {
    // If that fails, assume it's a relative URL and provide a base
    u = new URL(url, 'http://redact.url');
    isRelative = true;
  }

  const keys = Array.from(u.searchParams.keys());

  // If there are no query parameters to redact, we don't need to do anything.
  if (keys.length === 0) {
    return url;
  }

  // Redact all query parameters
  keys.forEach(key => {
    u.searchParams.set(key, '[redacted]');
  });

  // Reconstruct the URL string
  const redactedUrl = isRelative
    ? u.pathname + u.search + u.hash
    : u.toString();

  // URLSearchParams encodes brackets (e.g., %5Bredacted%5D).
  // We decode them back for better readability in logs.
  return redactedUrl.replace(/%5Bredacted%5D/g, '[redacted]');
};
