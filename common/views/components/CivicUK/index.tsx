// eslint-data-component: intentionally omitted
import { useTheme } from 'styled-components';

import cookies from '@weco/common/data/cookies';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { font } from '@weco/common/utils/classnames';

const headingStyles =
  'style="font-weight: 500; font-family: Inter, sans-serif;"';

// This format is required by Civic UK
export const policyUpdatedDate = '04/06/2025';

// Should your privacy policy change after a user gives consent,
// Cookie Control will invalidate prior records of consent and seek the user's preferences using the latest information available.
// https://www.civicuk.com/cookie-control/documentation/cookies
const statement = {
  description: 'You can read more about how we use cookies in our',
  name: 'Cookie policy',
  url: `/about-us/${prismicPageIds.cookiePolicy}`,
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
  const theme = useTheme();

  const notifyTitleStyles = `
  class="${font('sans-bold', 1)}"
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
    title: `<h1 class="${font('sans-bold', 2)}">Manage cookies</h1>`,
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

  return (
    <>
      <script
        src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
        type="text/javascript"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `CookieControl.load({
            product: 'PRO_MULTISITE',
            apiKey: '${apiKey}',
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
                  const event = new CustomEvent('consentChanged', { detail: { analyticsConsent: 'granted' }});
                  window.dispatchEvent(event);
                },
                onRevoke: function () {
                  const event = new CustomEvent('consentChanged', { detail: { analyticsConsent: 'denied' } });
                  window.dispatchEvent(event);
                },
                thirdPartyCookies: [
                  {
                    name: 'Google Analytics', optOutLink: 'http://tools.google.com/dlpage/gaoptout'
                  },
                  {
                    name: 'Hotjar', optOutLink: 'https://help.hotjar.com/hc/en-us/articles/360002735873-How-to-Stop-Hotjar-From-Collecting-your-Data'
                  },
                  {
                    name: 'YouTube',
                    optOutLink: 'https://myaccount.google.com/yourdata/youtube?hl=en&pli=1',
                  },
                  {
                    name: 'Vimeo',
                    optOutLink: 'https://vimeo.com/cookie_policy'
                  },
                ],
              },
              {
                name: 'marketing',
                label: '<h2 ${headingStyles}>Cookies for communications and marketing</h2>',
                description:
                  'We will use these to measure how you are interacting with our marketing and advertising materials, and the effectiveness of our campaigns.',
                onAccept: function () {
                  const event = new CustomEvent('consentChanged', { detail: { marketingConsent: 'granted' }});
                  window.dispatchEvent(event);
                },
                onRevoke: function () {
                  const event = new CustomEvent('consentChanged', { detail: { marketingConsent: 'denied' } });
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
                    name: 'TikTok',
                    optOutLink: 'https://www.tiktok.com/legal/page/global/tiktok-website-cookies-policy/en',
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
