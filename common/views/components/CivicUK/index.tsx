import cookies from '@weco/common/data/cookies';
import theme from '@weco/common/views/themes/default';
import { font } from '@weco/common/utils/classnames';

const headingStyles =
  'style="font-weight: 500; font-family: Inter, sans-serif;"';

const notifyTitleStyles = `
  class="${font('intm', 3)}"
  style="display: block; margin: ${theme.spacingUnits['4']}px 0;"
`;

// Notes for designing chat
// Toggle can't change border color, has to be same as background-color
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
  toggleColor: theme.color('black'),
  toggleBackground: theme.color('neutral.300'),
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

// Should your privacy policy change after a user gives consent,
// Cookie Control will invalidate prior records of consent and seek the user's preferences using the latest information available.
// https://www.civicuk.com/cookie-control/documentation/cookies
// TODO change URL and Updated as part of https://github.com/wellcomecollection/wellcomecollection.org/issues/10706
const statement = {
  description: 'You can read more about how we use cookies in our',
  name: 'Privacy policy',
  url: 'https://wellcome.org/who-we-are/privacy-and-terms',
  updated: '25/05/2018',
};

// Define all necessary cookies here and document their usage a little.
// Don't put comments in the return array as it gets stringified later.
const necessaryCookies = () => {
  // View @weco/common/data/cookies for details on each
  const wcCookies = Object.values(cookies).map(c => c);

  // Allows Prismic previews
  const prismicPreview = ['io.prismic.preview', 'isPreview'];

  // See @weco/toggles/webapp/toggles for details on each
  const featureFlags = ['toggle_*'];

  // Digirati auth related
  const digiratiCookies = ['dlcs-*'];

  return [...wcCookies, ...prismicPreview, ...featureFlags, ...digiratiCookies];
};

type Props = {
  apiKey: string;
};

const CivicUK = (props: Props) => (
  <>
    <script
      src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
      type="text/javascript"
    ></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `CookieControl.load({
            product: 'COMMUNITY',
            apiKey: '${props.apiKey}',
            product: 'pro',
            initialState: 'notify',
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
                cookies: [
                  '_ga',
                  '_ga*',
                  '_gid',
                  '_gat',
                  '__utma',
                  '__utmt',
                  '__utmb',
                  '__utmc',
                  '__utmz',
                  '__utmv',
                ],
                onAccept: function () {
                  const event = new CustomEvent('analyticsConsentChanged', { detail: { consent: 'granted' }});
                  window.dispatchEvent(event);
                },
                onRevoke: function () {
                  const event = new CustomEvent('analyticsConsentChanged', { detail: { consent: 'denied' } });
                  window.dispatchEvent(event);
                },
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

export default CivicUK;
