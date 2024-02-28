import { getCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

type CivicUKCookie = {
  optionalCookies?: {
    analytics: 'accepted' | 'revoked';
  };
};

export const getAnalyticsConsentState = (
  context?: GetServerSidePropsContext
): boolean => {
  const cookies = getCookies(context);
  const isCookiesWorkToggleOn = cookies.toggle_cookiesWork;
  const consentCookie = cookies.CookieControl;

  // Ensures this returns true for regular users
  // that don't have the "Cookie works" toggle on/have defined the consent cookie
  if (isCookiesWorkToggleOn && consentCookie !== undefined) {
    const civicUKCookie: CivicUKCookie = JSON.parse(
      decodeURIComponent(consentCookie)
    );
    return civicUKCookie.optionalCookies?.analytics === 'accepted';
  } else {
    return true;
  }
};
