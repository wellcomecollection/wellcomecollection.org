/** This file exists for three reasons:
 *
 *    1. To ensure that we use cookie names consistently, rather than
 *       passing around magic strings.
 *
 *    2. To make it easier to assess the set of custom cookies we're setting.
 *
 *    3. To make it easier for anyone to update the Cookie policy tables
 */

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

  // Records whether a user has dismissed our cookie banner.
  cookiesAccepted: 'WC_cookiesAccepted',

  // Remembers whether somebody is using the "mini" version of the API toolbar.
  apiToolbarMini: 'WC_apiToolbarMini',

  // Causes Segment session info to be logged to the dev console.
  analyticsDebug: 'WC_analyticsDebug',
};

export const cookiesTableCopy = {
  strictlyNecessaryCookies: [
    [
      `CivicUK`,
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
      `Auth0`,
      `auth0+A4`,
      `Used to implement the session layer for single sign on`,
      `Session`,
    ],
    [
      `Auth0`,
      `auth0_compart`,
      `Fallback for single sign-on on browsers that don't support the sameSite=None attribute`,
      `Session`,
    ],
    [
      `Auth0`,
      `did`,
      `Device identification for bot attack protection`,
      `Session`,
    ],
    [
      `Auth0`,
      `did_compat`,
      `Fallback for anomaly detection on browsers that don't support the sameSite=None attribute.`,
      `Session`,
    ],
    [
      `Auth0`,
      `wecoIdentitySession`,
      `Indicates that successful authentication occurred with the identity provider`,
      `7 days`,
    ],
    [
      `Wellcome`,
      `WC_userPreferenceGuideType`,
      `Used on exhibition guide pages to remember which type of digital exhibition guide the user prefers`,
      `8 hours`,
    ],
    [
      `Wellcome`,
      `WC_PopupDialog`,
      `Remembers that the user has cloesd the popup dialogso it is not displayed again`,
      `Session`,
    ],
    [
      `Wellcome`,
      `WC_globalAlert`,
      `Remembers that the user has closed the global alert banner so it is not displayed again`,
      `Session`,
    ],
    [
      `Wellcome`,
      `WC_siteIssueBanner`,
      `Remembers that the user has closed the banner about website issues so it is not displayed again`,
      `4 hours`,
    ],
    [
      `Wellcome`,
      `WC_wellcomeImagesRedirect`,
      `Used to indicate if the user has closed the banner you see when you've been redirected from Wellcome Images`,
      `2036-12-31T23:59:59Z`,
    ],
    [
      `Wellcome`,
      `WC_apiToolbarMini`,
      `Used to indicate if the user is using the "mini" version of the API toolbar`,
      `Session`,
    ],
    [
      `Wellcome`,
      `toggle_*`,
      `Set by Wellcome to switch on/off website features that are under development, or only intended for a subset of users e.g. Wellcome staff or people taking part in usability research`,
      `1 year`,
    ],
    [
      `Cloudflare`,
      `__cf_bm`,
      `Used to read and filter requests from bots`,
      `30 mins`,
    ],
    [`Prismic`, `Prismic-auth`, `Allows requests to Prismic API`, `Session`],
    [`Google`, `Ar_debug`, `Used by Google Ad Services to debug ads`, `1 year`],
    [
      `YouTube`,
      `VISITOR_PRIVACY_METADATA`,
      `Stores the user's cookie consent state for the current domain`,
      `180 days`,
    ],
  ],
  analyticsCookies: [
    [
      `Google Analytics`,
      `_ga`,
      `Used by Google Analytics to register a unique ID that distinguishes visitors and generate statistical data on how each visitor uses the website`,
      `2 years`,
    ],
    [
      `Google Analytics`,
      `_ga_<container-id>`,
      `Used by Google Analytics to persist session state`,
      `2 years`,
    ],
    [
      `Google Analytics`,
      `_gid`,
      `Used by Google Analytics, these help us count how many people visit wellcomecollection.org by tracking if you’ve visited before`,
      `1 day`,
    ],
    [
      `Google Analytics`,
      `_gat`,
      `Used to monitor number of Google Analytics server requests when using Google Tag Manager`,
      `1 min`,
    ],
    [
      `Google Analytics`,
      `_dc_gtm_`,
      `Used to monitor number of Google Analytics server requests`,
      `1 min`,
    ],
    [
      `Google Analytics`,
      `AMP_TOKEN`,
      `Contains a token code that is used to read out a Client ID from the AMP Client ID Service. By matching this ID with that of Google Analytics, users can be matched when switching between AMP content and non-AMP content`,
      `1 year`,
    ],
    [
      `Google Analytics`,
      `_gat_`,
      `Used to set and get tracking data`,
      `1 hour`,
    ],
    [
      `Google Analytics`,
      `_utma`,
      `ID used to identify users and Sessions`,
      `2 years`,
    ],
    [
      `Google Analytics`,
      `_utmt`,
      `Used to monitor number of Google Analytics server requests`,
      `10 mins`,
    ],
    [
      `Google Analytics`,
      `_utmb`,
      `Used to distinguish new sessions and visits. This cookie is set when the GA.js javascript library is loaded and there is no existing __utmb cookie. The cookie is updated every time data is sent to the Google Analytics server.`,
      `30 mins`,
    ],
    [
      `Google Analytics`,
      `_utmz`,
      `Contains information about the traffic source or campaign that directed user to the website. The cookie is set when the GA.js javascript is loaded and updated when data is sent to the Google Anaytics server`,
      `182 days`,
    ],
    [
      `Segment`,
      `ajs_anonymous_id`,
      `These cookies identify user sessions with an anonymous ID generated by Analytics.js`,
      `1 year`,
    ],
    [
      `Segment`,
      `ajs_group_id`,
      `A group ID that can be specified by making a group call with Analytics.js`,
      `1 year`,
    ],
    [
      `Segment`,
      `ajs_user_id`,
      `A user ID that can be specified by making an identify call with Analytics.js`,
      `1 year`,
    ],
    [
      `HotJar`,
      `_hjSessionUser_#`,
      `Collects statistics on the visitor's visits to the website, such as the number of visits, average time spent on the website and what pages have been read.`,
      `1 Year`,
    ],
    [
      `HotJar`,
      `_hjSession_#`,
      `Collects statistics on the visitor's visits to the website, such as the number of visits, average time spent on the website and what pages have been read.`,
      `30 minutes`,
    ],
    [
      `HotJar`,
      `hjViewportId`,
      `Saves the user's screen size in order to adjust the size of images on the website.`,
      `Session`,
    ],
    [
      `HotJar`,
      `hjActiveViewportIds`,
      `Contains an ID string on the current session. This contains non-personal information on what subpages the visitor enters – this information is used to optimize the visitor's experience.`,
      `Session`,
    ],
    [
      `Google`,
      `td`,
      `Registers statistical data on users' behaviour on the website. Used for internal analytics by the website operator.`,
      `Session`,
    ],
    [
      `YouTube`,
      `PREF`,
      `Used to store information such as a user's preferred page configuration and playback preferences like autoplay, shuffle content, and player size.`,
      `243 days`,
    ],
    [
      `YouTube`,
      `VISITOR_INFO1_LIVE`,
      `Tries to estimate the users' bandwidth on pages with integrated YouTube videos`,
      `180 days`,
    ],
  ],
  marketingCookies: [
    [
      `YouTube`,
      `YSC`,
      `Stores and tracks views on embedded YouTube videos`,
      `Session`,
    ],
    [
      `Google`,
      `_gac_`,
      `Contains information related to marketing campaigns of the user. These are shared with Google AdWords / Google Ads when the Google Ads and Google Analytics accounts are linked together.`,
      `90 days`,
    ],
    [
      `Segment`,
      `__tld__`,
      `Used to track visitors on multiple websites, in order to present relevant advertisement based on the visitor's preferences`,
      `Session`,
    ],
  ],
};

export default cookies;
