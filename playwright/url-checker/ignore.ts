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
