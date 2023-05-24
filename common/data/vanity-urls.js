/** This defines the vanity URLs for pages on wellcomecollection.org.
 *
 * == What it looks like for users ==
 *
 * This will have two effects for users:
 *
 *    1. If they visit the vanity URL, they'll be shown the content for that page.
 *       e.g. if somebody visits /about-us, they'll be shown the Prismic page Wuw2MSIAACtd3Stq
 *
 *    2. If they visit the URL with an ID, they'll get a 301 Permanent Redirect
 *       to the vanity URL.
 *       e.g. if somebody visits /pages/Wuw2MSIAACtd3Stq, they'll be redirected to /about-us
 *
 *       This is to avoid splitting the Google juice for that page over two URLs.
 *
 * Note: there is currently no mechanism for _removing_ vanity URLs that won't break
 * incoming links; please be v careful about removing items from this list.
 *
 * == When we use vanity URLs ==
 *
 * We can set up a vanity/marketing redirect in these cases:
 *
 *    - It’s a key landing page
 *    - It’s meant to be read aloud
 *    - User needs to remember to write it down
 *    - Print to digital transmission
 *
 * See https://www.notion.so/wellcometrust/URLs-on-wellcomecollection-org-26f1c2fc1cce43ca98c9b616de13c2d7
 *
 */

const { prismicPageIds } = require('./hardcoded-ids');

const vanityUrls = [
  {
    url: '/about-us',
    prismicId: prismicPageIds.aboutUs,
  },
  {
    url: '/access',
    prismicId: prismicPageIds.access,
  },
  {
    url: '/covid-welcome-back',
    prismicId: prismicPageIds.covidWelcomeBack,
    template: '/covid-welcome-back',
  },
  {
    url: '/get-involved',
    prismicId: prismicPageIds.getInvolved,
  },
  {
    url: '/opening-times',
    prismicId: prismicPageIds.openingTimes,
  },
  {
    url: '/press',
    prismicId: prismicPageIds.press,
  },
  {
    url: '/schools',
    prismicId: prismicPageIds.schools,
  },
  {
    url: '/user-panel',
    prismicId: prismicPageIds.userPanel,
  },
  {
    url: '/venue-hire',
    prismicId: prismicPageIds.venueHire,
  },
  {
    url: '/what-we-do',
    prismicId: prismicPageIds.whatWeDo,
  },
  {
    url: '/youth',
    prismicId: prismicPageIds.youth,
  },
];

module.exports = { vanityUrls };
