const expectedChecks = [
  {
    url: 'https://api.wellcomecollection.org/catalogue/v2/images/sws5gyfw',
    alias: 'Images API Single Image',
    period: 60,
  },
  {
    url:
      'https://api.wellcomecollection.org/catalogue/v2/images?query=medicine',
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
    url:
      'https://iiif-origin.wellcomecollection.org/image/L0059534.jpg/full/800,/0/default.jpg',
    alias: 'IIIF API (Origin/Loris)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/',
    alias: 'Front End Homepage (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/works/progress',
    alias: 'Progress notes (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/articles/Wcj2kSgAAB-3C4Uj',
    alias: 'Front End Article (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/events/W4VKXR4AAB4AeXU7',
    alias: 'Front End Event (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/exhibitions/WZwh4ioAAJ3usf86',
    alias: 'Front End Exhibition (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/stories',
    alias: 'Front End Stories (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/visit-us',
    alias: 'Front End Visit-us (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/whats-on',
    alias: "Front End What's on? (Origin)",
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/works/sgmzn6pu',
    alias: 'Front End Single Work Page (Origin)',
    period: 60,
  },
  {
    url: 'https://preview.wellcomecollection.org/works?query=botany',
    alias: 'Front End Works Search (Origin)',
    period: 60,
  },
  {
    url: 'https://wellcomecollection.org/visit-us',
    alias: 'Front End Visit-us (Cached)',
    period: 60,
  },
  {
    url: 'https://wellcomecollection.org/',
    alias: 'Front End Homepage (Cached)',
    period: 120,
  },
  {
    url: 'https://wellcomecollection.org/works/sgmzn6pu',
    alias: 'Front End Single Work Page (Cached)',
    period: 120,
  },
  {
    url: 'https://wellcomecollection.org/works?query=botany',
    alias: 'Front End Works Search (Cached)',
    period: 120,
  },
  {
    url: 'https://wellcomeimages.org/indexplus/image/L0030772.html',
    alias: 'Wellcome Images Redirect',
    period: 120,
    note: 'This is from Wikimedia Commons linking to Wellcome Images: https://commons.wikimedia.org/wiki/File:S._Pinaeus,_De_integritatis_et_corruptionis_virginum..._Wellcome_L0030772.jpg'
  },
];

export default expectedChecks;
