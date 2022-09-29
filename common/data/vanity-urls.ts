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
];
