import {Picture} from '../../../model/picture';

export const name = 'Captioned image';
export const handle = 'captioned-image';
const image = new Picture({
  contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/10/featured-image-dans-blog2.jpg',
  caption: 'An edited frame from Animating the Body',
  width: 1380,
  height: 1104
}).toJS();
export const context = { image };
export const variants = [
  { name: 'full', context: { image, full: true } },
  { name: 'bleed', context: { image, bleed: true } },
  { name: 'max-out-height', context: { image, maxOutHeight: true } }
];
