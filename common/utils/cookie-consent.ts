import { getCookie, setCookie } from 'cookies-next';
import { TmpCookiesObj } from 'cookies-next/lib/types';

// cookieConsent's value is a stringified object that looks like
// {
//   necessary: boolean,
//   analytics: boolean
// }
const currentCookieConsent =
  !!getCookie('cookieConsent') &&
  JSON.parse(getCookie('cookieConsent') as string);

// hasCookiesWorkToggleOn makes sure the rendering for regular users
// ignores all the checks and conditions, they should always be
// defaulting to true for them
export const getConsentCookie = (type: string): boolean => {
  const hasCookiesWorkToggleOn = getCookie('toggle_cookiesWork');

  return hasCookiesWorkToggleOn ? !!currentCookieConsent[type] : true;
};

// hasCookiesWorkToggleOn makes sure the rendering for regular users
// ignores all the checks and conditions, they should always be
// defaulting to true for them
export const getConsentCookieServerSide = (
  cookies: TmpCookiesObj,
  type: string
): boolean => {
  const hasCookiesWorkToggleOn = cookies.toggle_cookiesWork;

  const parsedCookie = hasCookiesWorkToggleOn
    ? cookies.cookieConsent && JSON.parse(cookies.cookieConsent)
    : { necessary: true, analytics: true };

  return !!parsedCookie[type];
};

export const toggleCookieConsent = () => {
  const newValue = !currentCookieConsent?.analytics;

  setCookie(
    'cookieConsent',
    JSON.stringify({
      necessary: true,
      analytics: newValue,
    })
  );

  // if (newValue === false) {
  //   removeAnalyticsCookies();
  // }

  window.location.reload();
};

// const removeAnalyticsCookies = () => {
// deleteCookies([]);
// };
