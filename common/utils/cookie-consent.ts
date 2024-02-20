import { getCookie } from 'cookies-next';
import { DocumentContext } from 'next/document';

type OptionalCookieState = 'accepted' | 'rejected';
type CookieControlCookie = {
  optionalCookies: {
    analytics: OptionalCookieState;
  };
};

type ConsentState = {
  analytics: boolean;
};

export const getConsentState = (
  ctx: DocumentContext | undefined = undefined
) => {
  const cookieControlCookie = getCookie('CookieControl', ctx);

  console.log(cookieControlCookie);

  const controlCookie =
    cookieControlCookie !== undefined
      ? (JSON.parse(cookieControlCookie) as CookieControlCookie)
      : undefined;

  const consentState: ConsentState = {
    analytics: controlCookie?.optionalCookies.analytics === 'accepted',
  };

  return consentState;
};

export const showPrivacySettings = () => {
  window.CookieControl.open();
};
