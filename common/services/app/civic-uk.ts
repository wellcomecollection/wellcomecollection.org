import { getCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

import { isValidKioskMode } from '@weco/common/contexts/KioskContext';
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
  const kioskModeCookie = isValidKioskMode(cookies.toggle_kioskMode);

  // Kiosk mode overrides consent and always allows analytics and marketing
  if (kioskModeCookie) return true;

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
): ConsentStatusProps => {
  const cookies = getCookies(context);

  return {
    analytics: getConsentState('analytics', context),
    marketing: getConsentState('marketing', context),
    cookieExists:
      cookies.CookieControl !== undefined ||
      isValidKioskMode(cookies.toggle_kioskMode),
  };
};

/**
 * Gets consent state for error pages and other pages that don't have access to server data.
 *
 * Error pages bypass the normal getServerSideProps flow, so they can't access serverData.consentStatus.
 * This function is called directly from _document.tsx's getInitialProps as a fallback.
 */
export const getErrorPageConsent = ({ req, res }): ConsentStatusProps => {
  const cookies = getCookies({ req, res });

  // Kiosk mode overrides consent and always allows analytics and marketing
  if (isValidKioskMode(cookies.toggle_kioskMode)) {
    return { analytics: true, marketing: true, cookieExists: true };
  }

  if (cookies.CookieControl !== undefined) {
    const civicUKCookie: CivicUKCookie = JSON.parse(cookies.CookieControl);

    return {
      analytics: civicUKCookie?.optionalCookies?.analytics === 'accepted',
      marketing: civicUKCookie?.optionalCookies?.marketing === 'accepted',
      cookieExists: true,
    };
  }

  // If not found, it's because consent has not yet been given.
  return { analytics: false, marketing: false, cookieExists: false };
};
