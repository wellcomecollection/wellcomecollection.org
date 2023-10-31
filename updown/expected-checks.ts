import { CheckInterval, CheckOptions } from 'node-updown/lib/types/Check';

const contentChecks = [
  {
    url: '/',
    alias: 'Experience: Content: Homepage',
  },
  {
    url: '/stories',
    alias: 'Experience: Content: Stories',
  },
  {
    url: '/whats-on',
    alias: "Experience: Content: What's on",
  },
  {
    url: '/visit-us',
    alias: 'Experience: Content: Visit us',
  },
  {
    url: '/articles/Wcj2kSgAAB-3C4Uj',
    alias: 'Experience: Content: Story',
  },
  {
    url: '/events/W4VKXR4AAB4AeXU7',
    alias: 'Experience: Content: Event',
  },
  {
    url: '/exhibitions/WZwh4ioAAJ3usf86',
    alias: 'Experience: Content: Exhibition',
  },
  {
    url: '/collections',
    alias: 'Experience: Content: Collections search',
  },
  {
    url: '/robots.txt',
    alias: 'Experience: Content: robots.txt',
  },
].flatMap(withOriginPrefix('content'));

const worksChecks = [
  {
    url: '/works?query=botany',
    alias: 'Experience: Works: Works search',
  },
  {
    url: '/works/e7vav3ss',
    alias: 'Experience: Works: Work',
  },
  {
    url: '/works/e7vav3ss/items',
    alias: 'Experience: Works: Work items',
  },
  {
    url: '/images?query=skeletons',
    alias: 'Experience: Works: Images search',
  },
  {
    url: '/works/pbxd2mgd/images?id=q6h754ua',
    alias: 'Experience: Works: Image',
  },
  {
    url: '/search/images?query=skeletons',
    alias: 'Experience: Works: Images search',
  },
  {
    url: '/concepts/v3m7uhy9',
    alias: 'Experience: Works: Concept',
  },
].flatMap(withOriginPrefix('works'));

const apiChecks = [
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/images?query=medicine',
    alias: 'API: Images: Search',
    period: 60 as CheckInterval,
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/images/sws5gyfw',
    alias: 'API: Images: Image',
    period: 60 as CheckInterval,
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/works?query=botany',
    alias: 'API: Works: Search',
    period: 60 as CheckInterval,
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/works/tp3rer3n',
    alias: 'API: Works: Work',
    period: 60 as CheckInterval,
  },
];

const expectedChecks = contentChecks.concat(worksChecks, apiChecks, [
  {
    url: 'https://i.wellcomecollection.org/assets/icons/favicon-16x16.png',
    alias: 'Experience: Assets: Favicon',
    period: 60 as CheckInterval,
  },
  {
    url: 'https://dlcs.io/health',
    alias: 'DLCS: API: IIIF (origin)',
    period: 60 as CheckInterval,
  },
  {
    // This is from Wikimedia Commons linking to Wellcome Images:
    // https://commons.wikimedia.org/wiki/File:S._Pinaeus,_De_integritatis_et_corruptionis_virginum..._Wellcome_L0030772.jpg
    url: 'https://wellcomeimages.org/indexplus/image/L0030772.html',
    alias: 'Wellcome Images Redirect',
    period: 120 as CheckInterval,
  },
]);

function withOriginPrefix(originPrefix: string) {
  return ({ url, alias }: CheckOptions) => [
    {
      url: `https://${originPrefix}.wellcomecollection.org${url}`,
      alias: `${alias} (origin)`,
      period: 60 as CheckInterval,
    },
    {
      url: `https://wellcomecollection.org${url}`,
      alias: `${alias} (cached)`,
      period: 60 as CheckInterval,
    },
  ];
}

export default expectedChecks;
