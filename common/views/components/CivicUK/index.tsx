// eslint-data-component: intentionally omitted
import { useTheme } from 'styled-components';

import cookies from '@weco/common/data/cookies';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { typography } from '@weco/common/utils/classnames';
import {
  brandButtonColors,
  designSystemColor,
} from '@weco/common/views/themes/config';

const headingStyles =
  'style="font-weight: 500; font-family: Inter, sans-serif;"';

// This format is required by Civic UK
export const policyUpdatedDate = '01/10/2026';

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
  // starred_toggles: which toggles a dashboard user has starred for the
  // on-site ToggleWidget - not a toggle_<id> override itself, so it needs
  // its own entry (see dash/webapp/.../toggles.helpers.ts).
  const featureFlags = ['toggle_*', 'starred_toggles'];

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

const CivicUK = ({ apiKey, defer }: { apiKey: string; defer?: boolean }) => {
  const theme = useTheme();

  const notifyTitleStyles = `
  class="${typography('body', 'xl', 'strong')}"
  style="display: block; margin: ${theme.spacingUnits['150']} 0;"
`;

  const branding = {
    removeIcon: true,
    removeAbout: true,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9375rem',
    fontSizeHeaders: '1.175rem',
    fontColor: theme.color('black'),
    backgroundColor: theme.color({
      brand: 'neutral.10',
      legacy: 'warmNeutral.200',
    }),
    // In the brand, Accept and Essential only are equal primary buttons
    acceptText: theme.color({ brand: 'neutral.10', legacy: 'black' }),
    acceptBackground: theme.color({ brand: 'indigo.50', legacy: 'yellow' }),
    rejectText: theme.color({ brand: 'neutral.10', legacy: 'black' }),
    ...(theme.brandUpdate && {
      rejectBackground: designSystemColor('indigo.50'),
    }),
    toggleColor: theme.brandUpdate ? designSystemColor('indigo.50') : '#0055cc',
    toggleBackground: theme.color({
      brand: 'neutral.20',
      legacy: 'neutral.300',
    }),
    toggleText: theme.color('black'),
  };

  // What Civic's branding options can't set: button shapes and states, and
  // Manage cookies as a secondary button. Civic uses !important, so we do too
  const primary = brandButtonColors.primary;
  const secondary = brandButtonColors.secondary;
  const primaryButtons =
    '#ccc .ccc-notify-button.ccc-accept-button, #ccc .ccc-notify-button.ccc-reject-button, #ccc .ccc-notify-button.ccc-close-button';
  const secondaryButton =
    '#ccc .ccc-notify-button:not(.ccc-accept-button):not(.ccc-reject-button):not(.ccc-close-button)';
  const brandStyles = `
    #ccc .ccc-content--light h1,
    #ccc .ccc-content--light h2,
    #ccc .ccc-content--light h3,
    #ccc .ccc-content--light span {
      color: ${designSystemColor('neutral.70')} !important;
    }
    #ccc .ccc-notify-button {
      border-radius: 0 !important;
    }
    ${primaryButtons} {
      border-color: ${designSystemColor(primary.default.border)} !important;
    }
    ${primaryButtons.replaceAll(', ', ':active, ')}:active {
      background-color: ${designSystemColor(primary.active.background)} !important;
      border-color: ${designSystemColor(primary.active.border)} !important;
    }
    ${secondaryButton} {
      background-color: ${designSystemColor(secondary.default.background)} !important;
      border-color: ${designSystemColor(secondary.default.border)} !important;
    }
    ${secondaryButton}:active {
      background-color: ${designSystemColor(secondary.active.background)} !important;
      border-color: ${designSystemColor(secondary.active.border)} !important;
    }
    ${secondaryButton}, ${secondaryButton} span {
      color: ${designSystemColor(secondary.default.text)} !important;
    }
    #ccc .ccc-notify-button:hover span,
    #ccc .ccc-notify-button:active span {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 0.2em;
    }
    #ccc .ccc-notify-button:focus-visible {
      outline: 2px solid ${designSystemColor('neutral.70')} !important;
      outline-offset: 2px;
      box-shadow: 0 0 0 2px ${designSystemColor('neutral.05')} !important;
    }
  `;

  const text = {
    title: `<h1 class="${typography('heading', 'xl', 'strong', 'sans')}">Manage cookies</h1>`,
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

  // Defer the Civic script for returning users who have interacted with the banner.
  // The config script uses type="module" when deferred — module scripts are implicitly
  // deferred and execute in document order after preceding defer scripts, so
  // CookieControl is guaranteed to be defined when .load() is called.
  // On a first visit, both scripts remain render-blocking.
  const cookieControlConfig = `CookieControl.load({
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
          });`;

  return (
    <>
      {theme.brandUpdate && <style>{brandStyles}</style>}
      <script
        src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
        type="text/javascript"
        defer={defer}
      ></script>
      <script
        type={defer ? 'module' : 'text/javascript'}
        dangerouslySetInnerHTML={{
          __html: cookieControlConfig,
        }}
      />
    </>
  );
};

export default CivicUK;
