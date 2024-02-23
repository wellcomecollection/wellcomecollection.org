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

const CivicUK = () => (
  <>
    <script
      src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
      type="text/javascript"
    ></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `CookieControl.load({
            product: 'COMMUNITY',
            apiKey: '73fee8f69cf633d66fae404ddd69d2559af7f887',
            branding: { removeIcon: true }, // PRO only
            necessaryCookies: ['toggle_*'],
            optionalCookies: [
              {
                name: 'analytics',
                label: 'Google Analytics, Segment, HotJar',
                description: 'Analytical cookies help us to improve our website by collecting and reporting information on its usage.',
                cookies: ['_ga', '_ga*', '_gid', '_gat', '__utma', '__utmt', '__utmb', '__utmc', '__utmz', '__utmv'],
                onAccept: function () {
                  const event = new CustomEvent('analyticsConsentChange', {});
                  window.dispatchEvent(event);
                },
                onRevoke: function () {
                  const event = new CustomEvent('analyticsConsentChange', {});
                  window.dispatchEvent(event);
                }
              }
            ],
          });`,
      }}
    />
  </>
);

export default CivicUK;
