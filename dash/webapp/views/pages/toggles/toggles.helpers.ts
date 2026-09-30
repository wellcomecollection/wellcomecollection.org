import { deleteCookie, setCookie } from 'cookies-next';

export type FeatureFlag = {
  id: string;
  title: string;
  defaultValue: boolean;
  description: string;
  type: 'permanent' | 'experimental' | 'test' | 'stage';
  documentationLink?: string;
  dateCreated?: string;
  dateActivated?: string;
};

export type ToggleStates = { [id: string]: boolean | undefined };

const isLocalhost = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

// Shared by every cookie this page writes - a toggle override, or the
// starred-toggles list. Deleting a cookie only needs domain to match.
const standardCookieOptions = () => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  return {
    domain: isLocalhost() ? undefined : '.wellcomecollection.org',
    expires,
    secure: !isLocalhost(),
  };
};

export const setCookieCustom = (key: string, value: string) =>
  setCookie(`toggle_${key}`, value, standardCookieOptions());

export const deleteCookieCustom = (key: string) =>
  deleteCookie(`toggle_${key}`, {
    domain: isLocalhost() ? undefined : '.wellcomecollection.org',
  });

// Which toggles (of any kind) show up in the on-site ToggleWidget. Not a
// toggle_<id> override cookie itself - a plain list of ids, read by the
// widget on wellcomecollection.org as well as written here.
export const STARRED_TOGGLES_COOKIE = 'starred_toggles';
export const MAX_STARRED_TOGGLES = 6;

export const parseStarredToggles = (
  cookieValue: string | undefined
): string[] => (cookieValue ? cookieValue.split(',').filter(Boolean) : []);

export const setStarredToggles = (ids: string[]) =>
  setCookie(STARRED_TOGGLES_COOKIE, ids.join(','), standardCookieOptions());
