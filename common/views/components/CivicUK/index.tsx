import cookies from '@weco/common/data/cookies';
import theme from '@weco/common/views/themes/default';
import { font } from '@weco/common/utils/classnames';
import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext/AppContext';

const headingStyles =
  'style="font-weight: 500; font-family: Inter, sans-serif;"';

const notifyTitleStyles = `
  class="${font('intm', 3)}"
  style="display: block; margin: ${theme.spacingUnits['4']}px 0;"
`;

const branding = {
  removeIcon: true,
  removeAbout: true,
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.9375rem',
  fontSizeHeaders: '1.175rem',
  fontColor: theme.color('black'),
  backgroundColor: theme.color('warmNeutral.200'),
  acceptText: theme.color('black'),
  acceptBackground: theme.color('yellow'),
  rejectText: theme.color('black'),
  toggleColor: '#0055cc',
  toggleBackground: theme.color('neutral.300'),
  toggleText: theme.color('black'),
};

const text = {
  title: `<h1 class="${font('intm', 2)}">Manage cookies</h1>`,
  intro:
    "We use cookies to make our website work. To help us make our marketing and website better, we'd like your consent to use cookies on behalf of third parties too.",
  necessaryTitle: `<h2 ${headingStyles}>Essential cookies</h2>`,
  necessaryDescription:
    'These cookies are necessary for our website to function and therefore always need to be on.',
  notifyTitle: `<span ${notifyTitleStyles}>Our website uses cookies</span>`,
  notifyDescription:
    "We use cookies to make our website work. To help us make our marketing and website better, we'd like your consent to use cookies on behalf of third parties too.",
  closeLabel: '<span style="font-weight: normal;">Save and close</span>',
  settings: 'Manage cookies',
  accept: 'Accept all',
  acceptSettings: 'Accept all',
  reject: 'Essential only',
  rejectSettings: 'Essential only',
};

// This format is required by Civic UK
export const policyUpdatedDate = '17/04/2024';

// Should your privacy policy change after a user gives consent,
// Cookie Control will invalidate prior records of consent and seek the user's preferences using the latest information available.
// https://www.civicuk.com/cookie-control/documentation/cookies
const statement = {
  description: 'You can read more about how we use cookies in our',
  name: 'Cookie policy',
  url: '/cookie-policy',
  updated: policyUpdatedDate,
};

// Define all necessary cookies here and document their usage a little.
// Don't put comments in the return array as it gets stringified later.
const necessaryCookies = () => {
  // View @weco/common/data/cookies for details on each
  const wcCookies = Object.values(cookies).map(c => c);

  // See @weco/toggles/webapp/toggles for details on each
  const featureFlags = ['toggle_*'];

  // Allows Prismic previews
  const prismicPreview = ['io.prismic.preview', 'isPreview'];

  // Digirati auth related
  const digiratiCookies = ['dlcs-*'];

  // Auth0 related
  const auth0 = ['wecoIdentitySession*'];

  return [
    ...wcCookies,
    ...featureFlags,
    ...prismicPreview,
    ...digiratiCookies,
    ...auth0,
  ];
};

const analyticsCookies = ['_gid', '_gat', '_ga*', 'ajs_anonymous_id'];

const CivicUK = ({ apiKey }: { apiKey: string }) => {
  const { hasAcknowledgedCookieBanner, setHasAcknowledgedCookieBanner } =
    useContext(AppContext);

  useEffect(() => {
    console.log('Civic UK loads');
    // If CookieControl has not been set yet;
    if (!hasAcknowledgedCookieBanner) {
      // If banner or popup is actively displaying on load;
      if (
        document.getElementById('ccc') &&
        document.getElementById('ccc-overlay')
      ) {
        console.log('open banner is detected');
        // Only once has the overlay gone from the DOM can we consider the cookie banner acknowledged
        const callback = mutationList => {
          for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
              console.log(
                'mutation happening, setting it to',
                document.getElementById('ccc')?.childElementCount === 0
              );
              setHasAcknowledgedCookieBanner(
                document.getElementById('ccc')?.childElementCount === 0
              );
            }
          }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
      } else if (!document.getElementById('ccc')) {
        // If the CivicUK script failed to load for any reason, we should consider it acknowledged by default.
        // We need this for our tests and Cardigan as well.
        setHasAcknowledgedCookieBanner(true);
        console.log('set ACB to true because there is no script loading');
      }
    }
  }, []);

  return (
    <>
      <script
        src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
        type="text/javascript"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `CookieControl.load({
            product: 'COMMUNITY',
            apiKey: '${apiKey}',
            product: 'pro',
            initialState: 'notify',
            consentCookieExpiry: 182,
            layout: 'popup',
            theme: 'light',
            setInnerHTML: true,
            closeStyle: 'button',
            settingsStyle: 'button',
            notifyDismissButton: false,
            necessaryCookies: ${JSON.stringify(necessaryCookies())},
            optionalCookies: [
              {
                name: 'analytics',
                label: '<h2 ${headingStyles}>Measure website use</h2>',
                description:
                  '<ul><li>We use these cookies to recognise you, to count your visits to the website, and to see how you move around it.</li><li>They help us to provide you with a good experience while you browse, for example by helping to make sure you can find what you need.</li><li>They also allows us to improve the way the website works.</li></ul>',
                cookies: ${JSON.stringify(analyticsCookies)}, 
                onAccept: function () {
                  const event = new CustomEvent('analyticsConsentChanged', { detail: { analyticsConsent: 'granted' }});
                  window.dispatchEvent(event);
                },
                onRevoke: function () {
                  const event = new CustomEvent('analyticsConsentChanged', { detail: { analyticsConsent: 'denied' } });
                  window.dispatchEvent(event);
                },
                thirdPartyCookies: [
                  {
                    name: 'Google Analytics', optOutLink: 'http://tools.google.com/dlpage/gaoptout'
                  },
                  {
                    name: 'Twilio Segment', optOutLink: 'https://www.twilio.com/en-us/legal/privacy'
                  },
                  {
                    name: 'Hotjar', optOutLink: 'https://help.hotjar.com/hc/en-us/articles/360002735873-How-to-Stop-Hotjar-From-Collecting-your-Data'
                  },
                  {
                    name: 'YouTube',
                    optOutLink: 'https://myaccount.google.com/yourdata/youtube?hl=en&pli=1',
                  },
                ],
              },
              {
                name: 'marketing',
                label: '<h2 ${headingStyles}>Cookies for communications and marketing</h2>',
                description:
                  'We will use these to measure how you are interacting with our marketing and advertising materials, and the effectiveness of our campaigns.',
                onAccept: function () {
                  const event = new CustomEvent('analyticsConsentChanged', { detail: { marketingConsent: 'granted' }});
                  window.dispatchEvent(event);
                },
                onRevoke: function () {
                  const event = new CustomEvent('analyticsConsentChanged', { detail: { marketingConsent: 'denied' } });
                  window.dispatchEvent(event);
                },
                thirdPartyCookies: [
                  {
                    name: 'GoogleAds', optOutLink: 'https://policies.google.com/technologies/ads?hl=en-US'
                  },
                  {
                    name: 'Meta',
                    optOutLink: 'https://www.facebook.com/privacy/policies/cookies',
                  },
                  {
                    name: 'TikTok', optOutLink: 'https://www.tiktok.com/privacy/ads-and-your-data/en-GB'
                  },
                ],
              },
            ],   
            statement: ${JSON.stringify(statement)},
            branding: ${JSON.stringify(branding)},
            text: ${JSON.stringify(text)}
          });`,
        }}
      />
    </>
  );
};

export default CivicUK;
