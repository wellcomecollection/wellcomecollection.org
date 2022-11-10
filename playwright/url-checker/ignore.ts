import { URL } from 'url';
import { Request } from 'playwright';

// We might have certain errors from pages which we want to ignore.
// It's best to be specific about these so ignoring them doesn't cause any false negatives
// We keep that logic in this file.

const ignoreXhrErrorPaths = ['/account/api/auth/me'];

export const ignoreRequestError = (request: Request): boolean => {
  const resourceType = request.resourceType();
  if (resourceType === 'xhr' || resourceType === 'fetch') {
    const url = request.url();
    const path = new URL(url).pathname;
    return ignoreXhrErrorPaths.includes(path);
  }
  return false;
};

// Error logs include network errors and other stuff that we are handling separately
export const ignoreErrorLog = (errorText: string): boolean => {
  // These are network errors
  if (errorText.includes('Failed to load resource')) {
    return true;
  }

  // This is a hard-to-pin down issue which seems to be related to webfonts
  // being slow to load when the URL checker is run in CI - it seems to be logged from
  // https://github.com/wellcometrust/wellcomecollection.org/blob/9d9b2e96c82f4ea913c58df6c7daf27ff7eac9b4/common/hooks/useIsFontsLoaded.ts#L27
  if (errorText.startsWith('Error: 3000ms timeout exceeded')) {
    return true;
  }

  return false;
};

export const ignoreMimeTypeMismatch = (request: Request): boolean => {
  // This covers a class of errors like:
  //
  //      Request for an image resource at https://www.googletagmanager.com/a?[long query string] returned an unexpected mime type text/html
  //
  // I seems to happen at random, and get worse if you re-run the tests -- I suspect GTM
  // is throttling requests that come from CI, and replacing a tracking pixel with
  // an HTML error page.  This kinda makes sense -- CI is loading dozens of pages in
  // parallel from a single IP address, which is very un-human-like behaviour.
  //
  // We can't do anything about GTM errors and we're not providing free uptime checking
  // for Google, so let these through rather than failing our e2e tests.
  if (request.url().startsWith('https://www.googletagmanager.com/')) {
    return true;
  }

  return false;
};
