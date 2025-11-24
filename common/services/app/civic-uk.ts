import { getCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

import { ConsentStatusProps } from '@weco/common/server-data/types';

export const ACTIVE_COOKIE_BANNER_ID = 'ccc-overlay';
export const COOKIE_BANNER_PARENT_ID = 'ccc';

type ConsentType = 'granted' | 'denied';
export type CookieConsentEvent = CustomEvent<{
  analyticsConsent?: ConsentType;
  marketingConsent?: ConsentType;
}>;

type CivicUKCookie = {
  optionalCookies?: {
    analytics: 'accepted' | 'revoked';
    marketing: 'accepted' | 'revoked';
  };
};

/**
 * Gets the current status of a specific consent category, passing the context in if server-side.
 *
 * @param {'analytics' | 'marketing'} type - Name of the category
 * @param {GetServerSidePropsContext | undefined} context - Server-side context
 */
export const getConsentState = (
  type: 'analytics' | 'marketing',
  context?: GetServerSidePropsContext
): boolean => {
  const cookies = getCookies(context);
  const consentCookie = cookies.CookieControl;

  // If consent has been defined, return its value
  if (consentCookie !== undefined) {
    const civicUKCookie: CivicUKCookie = JSON.parse(
      decodeURIComponent(consentCookie)
    );

    return civicUKCookie.optionalCookies?.[type] === 'accepted';
  } else {
    // Otherwise assume consent has not been given
    return false;
  }
};

export const getAllConsentStates = (
  context?: GetServerSidePropsContext
): ConsentStatusProps => ({
  analytics: getConsentState('analytics', context),
  marketing: getConsentState('marketing', context),
});

// Pages like error pages don't have access to server data
// and need workarounds to behave like normal pages.
export const getErrorPageConsent = ({ req, res }) => {
  const cookies = getCookies({ req, res });

  if (cookies.CookieControl !== undefined) {
    const civicUKCookie = JSON.parse(cookies.CookieControl);

    return {
      analytics: civicUKCookie?.optionalCookies?.analytics === 'accepted',
      marketing: civicUKCookie?.optionalCookies?.marketing === 'accepted',
    };
  }

  // If not found, it's because consent has not yet been given.
  return { analytics: false, marketing: false };
};
