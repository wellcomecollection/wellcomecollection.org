import { getCookie, getCookies, setCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

// WC_cookieConsent's value is a stringified object that looks like
// {
//   necessary: boolean,
//   analytics: boolean
// }
// That said, this is subject to change based on the chosen third party
// Then it might be worth typing it.

export const getAnalyticsConsentState = (
  context?: GetServerSidePropsContext
): boolean => {
  const cookies = getCookies(context);
  const isCookiesWorkToggleOn = cookies.toggle_cookiesWork;
  const consentCookie = cookies.WC_cookieConsent;

  // Ensures this returns true for regular users
  // that don't have the "Cookie works" toggle on/have defined the consent cookie
  if (isCookiesWorkToggleOn && consentCookie !== undefined) {
    return JSON.parse(decodeURIComponent(consentCookie)).analytics;
  } else {
    return true;
  }
};

export const toggleCookieConsent = () => {
  const currentCookieConsent =
    !!getCookie('WC_cookieConsent') &&
    JSON.parse(getCookie('WC_cookieConsent') as string);

  // Consent is CURRENTLY true by default,
  // So the first click on the mock-consent button should set preference to false
  const isPreferenceSet = currentCookieConsent?.analytics !== undefined;
  const newValue = isPreferenceSet ? !currentCookieConsent?.analytics : false;

  // Toggle analytics value in stringified value
  setCookie(
    'WC_cookieConsent',
    JSON.stringify({
      necessary: true,
      analytics: newValue,
    }),
    {
      path: '/',
    }
  );

  window.location.reload();
};
