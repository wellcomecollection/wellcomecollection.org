/** This file exists for two reasons:
 *
 *    1. To ensure that we use cookie names consistently, rather than
 *       passing around magic strings.
 *
 *    2. To make it easier to assess the set of custom cookies we're setting.
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

export default cookies;
