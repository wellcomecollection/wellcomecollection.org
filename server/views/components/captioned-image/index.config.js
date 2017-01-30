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
  { name: 'full', context: { image, modifiers: ['full'] } },
  { name: 'bleed', context: { image, modifiers: ['bleed'] } },
  { name: 'max-out-height', context: { image, modifiers: ['max-out-height'] } }
];
