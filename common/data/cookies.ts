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
};

export default cookies;
