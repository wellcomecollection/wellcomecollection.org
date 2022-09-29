/** This defines the vanity URLs for pages on wellcomecollection.org.
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
 */

import { prismicPageIds } from './hardcoded-ids';

type VanityUrl = {
  url: string;
  pageId: string;
  template?: string;
};

export const vanityUrls: VanityUrl[] = [
  {
    url: '/about-us',
    pageId: prismicPageIds.aboutUs,
  },
  {
    url: '/access',
    pageId: prismicPageIds.access,
  },
  {
    url: '/covid-welcome-back',
    pageId: prismicPageIds.covidWelcomeBack,
  },
  {
    url: '/get-involved',
    pageId: prismicPageIds.getInvolved,
  },
  {
    url: '/opening-times',
    pageId: prismicPageIds.openingTimes,
  },
  {
    url: '/press',
    pageId: prismicPageIds.press,
  },
  {
    url: '/schools',
    pageId: prismicPageIds.schools,
  },
  {
    url: '/user-panel',
    pageId: prismicPageIds.userPanel,
  },
  {
    url: '/venue-hire',
    pageId: prismicPageIds.venueHire,
  },
  {
    url: '/what-we-do',
    pageId: prismicPageIds.whatWeDo,
  },
  {
    url: '/youth',
    pageId: prismicPageIds.youth,
  },
  // This was added for the the printed gallery guide that will accompany
  // the Grace Ndiritu exhibition.
  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1664363102626599
  {
    url: '/colonial-roots',
    pageId: 'YLnsihAAACEAfsuu',
  },
];
