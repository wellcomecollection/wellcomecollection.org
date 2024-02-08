import { CookieValueTypes, getCookie, setCookie } from 'cookies-next';

const currentCookieConsent =
  !!getCookie('cookieConsent') &&
  JSON.parse(getCookie('cookieConsent') as string);

export const getConsentCookie = (type: string): boolean => {
  return !!currentCookieConsent[type];
};

export const getConsentCookieServerSide = (
  cookieValue: CookieValueTypes,
  type: string
): boolean => {
  const parsedCookie = !!cookieValue && JSON.parse(cookieValue);

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
