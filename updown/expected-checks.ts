import { CheckInterval, CheckOptions } from 'node-updown/lib/types/Check';

const contentChecks = [
  {
    url: '/',
    alias: 'Content: Homepage',
  },
  {
    url: '/stories',
    alias: 'Content: Stories',
  },
  {
    url: '/whats-on',
    alias: "Content: What's on",
  },
  {
    url: '/visit-us',
    alias: 'Content: Visit us',
  },
  {
    url: '/articles/Wcj2kSgAAB-3C4Uj',
    alias: 'Content: Story',
  },
  {
    url: '/events/W4VKXR4AAB4AeXU7',
    alias: 'Content: Event',
  },
  {
    url: '/exhibitions/WZwh4ioAAJ3usf86',
    alias: 'Content: Exhibition',
  },
  {
    url: '/collections',
    alias: 'Content: Collections search',
  },
  {
    url: '/robots.txt',
    alias: 'Content: robots.txt',
  },
].flatMap(withOriginPrefix('content'));

const worksChecks = [
  {
    url: '/works?query=botany',
    alias: 'Works: Works search',
  },
  {
    url: '/works/e7vav3ss',
    alias: 'Works: Work',
  },
  {
    url: '/works/e7vav3ss/items',
    alias: 'Works: Work items',
  },
  {
    url: '/images?query=skeletons',
    alias: 'Works: Images search',
  },
  {
    url: '/works/pbxd2mgd/images?id=q6h754ua',
    alias: 'Works: Image',
  },
  {
    url: '/search/images?query=skeletons',
    alias: 'Works: Images search',
  },
  {
    url: '/concepts/v3m7uhy9',
    alias: 'Works: Concept',
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
    alias: 'Assets: Favicon',
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
