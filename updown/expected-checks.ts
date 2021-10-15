import { Check } from './checks';

const contentChecks = [
  {
    url: '/',
    alias: 'Homepage',
  },
  {
    url: '/stories',
    alias: 'Stories',
  },
  {
    url: '/whats-on',
    alias: "What's on",
  },
  {
    url: '/visit-us',
    alias: 'Visit us',
  },
  {
    url: '/get-involved',
    alias: 'Visit us',
  },
  {
    url: '/about-us',
    alias: 'Visit us',
  },
  {
    url: '/articles/Wcj2kSgAAB-3C4Uj',
    alias: 'Story',
  },
  {
    url: '/events/W4VKXR4AAB4AeXU7',
    alias: 'Event',
  },
  {
    url: '/exhibitions/WZwh4ioAAJ3usf86',
    alias: 'Exhibition',
  },
  {
    url: '/works/progress',
    alias: 'Progress notes',
  },
  {
    url: '/collections',
    alias: 'Collections search',
  },
  {
    url: '/humans.txt',
    alias: 'humans.txt',
  },
].flatMap(withOriginPrefix('content'));

const worksChecks = [
  {
    url: '/works?query=botany',
    alias: 'Works search',
  },
  {
    url: '/works/e7vav3ss',
    alias: 'Work',
  },
  {
    url: '/works/e7vav3ss/items',
    alias: 'Items',
  },
  {
    url: '/images?query=skeletons',
    alias: 'Images search',
  },
  {
    url: '/works/pbxd2mgd/images?id=q6h754ua',
    alias: 'Image',
  },
].flatMap(withOriginPrefix('works'));

const expectedChecks = contentChecks.concat(worksChecks, [
  {
    url: 'https://i.wellcomecollection.org/assets/icons/favicon-16x16.png',
    alias: 'Favicon (assets)',
    period: 60,
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/images/sws5gyfw',
    alias: 'Images API Single Image',
    period: 60,
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/images?query=medicine',
    alias: 'Images API Search',
    period: 60,
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/works/sgmzn6pu',
    alias: 'Works API Single Work',
    period: 60,
  },
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/works?query=botany',
    alias: 'Works API Search',
    period: 60,
  },
  {
    url: 'https://dlcs.io/health.aspx',
    alias: 'IIIF API (Origin/DLCS)',
    period: 60,
  },
  {
    url: 'https://iiif-origin.wellcomecollection.org/image/L0059534.jpg/full/800,/0/default.jpg',
    alias: 'IIIF API (Origin/Loris)',
    period: 60,
  },
  {
    // This is from Wikimedia Commons linking to Wellcome Images:
    // https://commons.wikimedia.org/wiki/File:S._Pinaeus,_De_integritatis_et_corruptionis_virginum..._Wellcome_L0030772.jpg
    url: 'https://wellcomeimages.org/indexplus/image/L0030772.html',
    alias: 'Wellcome Images Redirect',
    period: 120,
  },
]);

function withOriginPrefix(originPrefix: string) {
  return ({ url, alias }: Check) => [
    {
      url: `https://${originPrefix}.wellcomecollection.org${url}`,
      alias: `${alias} (origin)`,
      period: 60,
    },
    {
      url: `https://wellcomecollection.org${url}`,
      alias: `${alias} (cached)`,
      period: 60,
    },
  ];
}

export default expectedChecks;
