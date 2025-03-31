import { Check } from './types';

export default [
  {
    // 'content' prefix is the origin (ie not cached by CloudFront)
    url: 'https://content.wellcomecollection.org/',
    name: 'Homepage',
    emailAlerts: true,
    slackAlerts: ['digital-general', 'alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/stories',
    name: 'Stories',
    emailAlerts: true,
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/whats-on',
    name: "What's on",
    emailAlerts: true,
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/visit-us',
    name: 'Visit us',
    emailAlerts: true,
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/articles/graphic-gallery--green',
    name: 'Story',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/events/cancelled--stronger--smarter----better-',
    name: 'Event',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/exhibitions/can-graphic-design-save-your-life-',
    name: 'Exhibition',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/visual-stories/genetic-automata-visual-story',
    name: 'Visual Story',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/collections',
    name: 'Collections search',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/robots.txt',
    name: 'robots.txt',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/search/works?query=botany',
    name: 'Works search',
    emailAlerts: true,
    slackAlerts: ['digital-general', 'alerts-channel'],
    apdexThreshold: 1.0, // We expect this to be a slower page
  },
  {
    url: 'https://content.wellcomecollection.org/works/e7vav3ss',
    name: 'Work',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/works/e7vav3ss/items',
    name: 'Work items',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/search/images?query=skeletons',
    name: 'Images search',
    emailAlerts: true,
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/works/pbxd2mgd/images?id=q6h754ua',
    name: 'Image',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://content.wellcomecollection.org/concepts/patspgf3',
    name: 'Concept',
    slackAlerts: ['alerts-channel'],
    apdexThreshold: 1.0, // We expect this to be a slower page
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/images?query=medicine',
    name: 'Images API: Search',
    emailAlerts: true,
    slackAlerts: ['digital-general', 'alerts-channel'],
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/images/sws5gyfw',
    name: 'Images API: Image',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/works?query=botany',
    name: 'Works API: Search',
    emailAlerts: true,
    slackAlerts: ['digital-general', 'alerts-channel'],
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/works/tp3rer3n',
    name: 'Works API: Work',
    slackAlerts: ['alerts-channel'],
    apdexThreshold: 1.0, // We expect this to be slower
  },
  {
    url: 'https://i.wellcomecollection.org/assets/icons/favicon-16x16.png',
    name: 'Assets: Favicon',
    slackAlerts: ['alerts-channel'],
  },
  {
    url: 'https://dlcs.io/health',
    name: 'DLCS: API: IIIF (origin)',
    emailAlerts: true,
    slackAlerts: ['alerts-channel'],
  },
  {
    // This is from Wikimedia Commons linking to Wellcome Images:
    // https://commons.wikimedia.org/wiki/File:S._Pinaeus,_De_integritatis_et_corruptionis_virginum..._Wellcome_L0030772.jpg
    url: 'https://wellcomeimages.org/indexplus/image/L0030772.html',
    name: 'Wellcome Images Redirect',
    slackAlerts: ['alerts-channel'],
  },
] as Check[];
