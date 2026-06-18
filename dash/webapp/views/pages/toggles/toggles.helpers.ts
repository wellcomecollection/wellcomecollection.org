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

export const setCookieCustom = (key: string, value: string) => {
  const nowPlusOneYear = new Date();
  nowPlusOneYear.setFullYear(nowPlusOneYear.getFullYear() + 1);

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  setCookie(`toggle_${key}`, value, {
    domain: isLocalhost ? undefined : '.wellcomecollection.org',
    expires: nowPlusOneYear,
    secure: !isLocalhost,
  });
};

export const deleteCookieCustom = (key: string) => {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  deleteCookie(`toggle_${key}`, {
    domain: isLocalhost ? undefined : '.wellcomecollection.org',
  });
};
