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
