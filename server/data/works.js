import {createPrismicParagraph} from  '../../common/utils/prismic';
export const worksLandingPromos = [{
  type: 'promo',
  url: 'https://wellcomecollection.org/pages/Wuw2MSIAACtd3Sr8',
  title: 'Who was Henry Wellcome?',
  description: `<p>Learn about Wellcome's founder, whose passion for medicine led him to collect more than a million objects.</p>`,
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/works_landing/henrywellcome_16_9.jpg',
    width: 1600,
    height: 900
  }
}, {
  type: 'promo',
  url: 'https://wellcomecollection.org/pages/Wuw2MSIAACtd3Stq',
  title: 'About Wellcome Collection',
  description: `<p>We are the free visitor destination for the incurably curious. Find out about our activities.</p>`,
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/works_landing/wellcomebuilding_16_9.jpg',
    width: 1600,
    height: 900
  }
}, {
  type: 'promo',
  url: 'https://wellcomelibrary.org/what-we-do/history-of-wellcome-library/',
  title: 'History of the Wellcome Library',
  description: `<p>The Wellcome Library is one of the world's major resources for the study of medical history.</p>`,
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/works_landing/library_16_9.jpg',
    width: 1600,
    height: 900
  }}
];

export const henryImage = {
  caption: createPrismicParagraph('Sir Henry Solomon Wellcome (1853—1936). Pharmacist, entrepreneur, philanthropist and collector.'),
  sizesQueries: '600px',
  image: {
    contentUrl: 'https://iiif.wellcomecollection.org/image/V0027772.jpg/full/full/0/default.jpg',
    width: 1600,
    height: 2182,
    alt: 'Portrait of Henry Wellcome',
    tasl: {
      title: 'Sir Henry Solomon Wellcome. Photograph by Lafayette Ltd',
      sourceName: 'Wellcome Collection',
      sourceLink: 'https://wellcomecollection.org/works/a2d9ywt8',
      author: null,
      license: 'CC-BY',
      copyrightHolder: 'Wellcome Collection',
      copyrightLink: 'https://wellcomecollection.org'
    }
  }
};
