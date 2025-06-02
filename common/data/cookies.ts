/** This file exists for three reasons:
 *
 *    1. To ensure that we use cookie names consistently, rather than
 *       passing around magic strings.
 *
 *    2. To make it easier to assess the set of custom cookies we're setting.
 *
 *    3. To make it easier for anyone to update the Cookie policy tables
 */

// **** IF MODIFYING ANY OF THESE *****
// Remember to modify cookiesTableCopy below as well.
const cookies = {
  // This is the cookie used in the exhibition guides to remember what
  // sort of guide a user prefers.  e.g. if somebody picks a BSL guide,
  // the next time they open the guide we'll take them to BSL without
  // asking them to pick again.
  exhibitionGuideType: 'WC_userPreferenceGuideType',

  // This is the cookie used in the popup dialog to remember when somebody
  // has closed the dialog.
  popupDialog: 'WC_PopupDialog',

  // This remembers when somebody has dismissed the global info banner.
  globalAlert: 'WC_globalAlert',

  // This remembers when somebody has dismissed the site issues info banner.
  siteIssueBanner: 'WC_siteIssueBanner',

  // This remembers when somebody has dismissed the banner you get when
  // you've been redirected from Wellcome Images.
  wellcomeImagesRedirect: 'WC_wellcomeImagesRedirect',

  // Causes Segment session info to be logged to the dev console.
  analyticsDebug: 'WC_analyticsDebug',
};

export const cookiesTableCopy = {
  '[necessary_cookies_table]': [
    ['Cookie name', 'Purpose', 'Duration'],
    [
      `CookieControl`,
      `This stores your cookie consent preferences`,
      `182 days`,
    ],
    [
      `SessionID`,
      `Preserves the visitor's session state across page requests`,
      `Persistant`,
    ],
    [
      `auth0+A4`,
      `Used to implement the session layer for single sign on`,
      `Session`,
    ],
    [
      `auth0_compat`,
      `Fallback for single sign-on on browsers that don't support the sameSite=None attribute`,
      `Session`,
    ],
    [`did`, `Device identification for bot attack protection`, `Session`],
    [
      `did_compat`,
      `Fallback for anomaly detection on browsers that don't support the sameSite=None attribute.`,
      `Session`,
    ],
    [
      `wecoIdentitySession`,
      `Indicates that successful authentication occurred with the identity provider`,
      `7 days`,
    ],
    [
      `WC_userPreferenceGuideType`,
      `Used on exhibition guide pages to remember which type of digital exhibition guide the user prefers`,
      `8 hours`,
    ],
    [
      `WC_PopupDialog`,
      `Remembers that the user has cloesd the popup dialogso it is not displayed again`,
      `Session`,
    ],
    [
      `WC_globalAlert`,
      `Remembers that the user has closed the global alert banner so it is not displayed again`,
      `Session`,
    ],
    [
      `WC_siteIssueBanner`,
      `Remembers that the user has closed the banner about website issues so it is not displayed again`,
      `4 hours`,
    ],
    [
      `WC_wellcomeImagesRedirect`,
      `Used to indicate if the user has closed the banner you see when<br />you've been redirected from Wellcome Images`,
      `2036-12-31T23:59:59Z`,
    ],
    [
      `toggle_*`,
      `Set by Wellcome to switch on/off website features that are under development, or only intended for<br />a subset of users e.g. Wellcome staff or people taking part in usability research`,
      `1 year`,
    ],
    [`__cf_bm`, `Used to read and filter requests from bots`, `30 mins`],
    [`Prismic-auth`, `Allows requests to Prismic API`, `Session`],
    [`Ar_debug`, `Used by Google Ad Services to debug ads`, `1 year`],
  ],
  '[analytics_cookies_table]': [
    ['Provider', 'Purpose'],
    [
      'Google Analytics',
      'With your permission, we use Google Analytics to to collect data about how you use the website. This information helps us to improve the website.<br />Google Analytics stores information about what pages you visit, how long you are on the site, how you got here and what you click., <br /><a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">Visit Google to see a full list of cookies and their uses</a>.',
    ],

    [
      'Twilio Segment',
      'With your permission, we use Segment to collect data about how you use the website. This information helps us to improve the website, such as improving our website search.<br /><a href="https://www.twilio.com/en-us/legal/privacy" target="_blank" rel="noopener noreferrer">Visit Segment&apos;s privacy statement</a>.',
    ],
    [
      'Hotjar',
      `With your permission, we use HotJar to help us understand how you are using the website. We use the data to inform changes we make to improve your experience.<br />Hotjar Analytics cookies store data about whether you have participated in a Hotjar survey, the way in which you interact with a page and what you click on while you are visiting the site.<br /><a href="https://help.hotjar.com/hc/en-us/articles/6952777582999-Cookies-Set-by-the-Hotjar-Tracking-Code" target="_blank" rel="noopener noreferrer">Visit HotJar's website to see a full list of cookies and their uses</a>.`,
    ],
    [
      'YouTube',
      `We embed videos on our websites from our official YouTube channel using YouTube's privacy-enhanced mode.<br />YouTube will not store personally-identifiable Cookie information for playbacks of embedded videos using the privacy-enhanced mode.<br /><a href="https://www.youtube.com/intl/ALL_uk/howyoutubeworks/our-commitments/protecting-user-data" target="_blank" rel="noopener noreferrer">Read about how YouTube maintains user privacy</a>.`,
    ],
    [
      'Vimeo',
      `We embed videos on our websites from our official Vimeo channel. With permission we collect data on how you interact with these videos.<br />This information helps us improve the digital content we create. <a href="https://help.vimeo.com/hc/en-us/articles/26080940921361-Vimeo-Player-Cookies" target="_blank" rel="noopener noreferrer">Visit Vimeo to see a full list of cookies and their uses</a>.`,
    ],
  ],
  '[marketing_cookies_table]': [
    ['Provider', 'Purpose'],
    [
      'GoogleAds',
      `We use tracking technologies to enhance the measurement, optimisation, and targeting of our advertising campaigns on Google.<br /><a href="https://business.safety.google/adscookies/" target="_blank" rel="noopener noreferrer">See the full list of cookies on Google&apos;s website</a>.`,
    ],
    [
      'Meta',
      `We use tracking technologies to enhance the measurement, optimisation, and targeting of our advertising campaigns on Meta (includes Facebook and Instagram).<br /><a href="https://www.facebook.com/privacy/policies/cookies?annotations[0]=explanation%2F1_common_cookies_and_uses" target="_blank" rel="noopener noreferrer">See the full list of cookies on Meta&apos;s website</a>.`,
    ],
    [
      'TikTok',
      `We use tracking technologies to enhance the measurement, optimisation, and targeting of our advertising campaigns on TikTok.<br /><a href="https://www.tiktok.com/legal/page/global/tiktok-website-cookies-policy/en" target="_blank" rel="noopener noreferrer">See TikTok&apos;s cookies policy</a>.`,
    ],
  ],
};

export default cookies;
