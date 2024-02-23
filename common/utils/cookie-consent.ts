import { getCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

// WC_cookieConsent's value is a stringified object that looks like
// {
//   necessary: boolean,
//   analytics: boolean
// }
// That said, this is subject to change based on the chosen third party
// Then it might be worth typing it.

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
