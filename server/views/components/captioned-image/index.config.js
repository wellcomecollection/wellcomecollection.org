// @flow
import {createPicture, type Picture} from '../../../model/picture';

export const name = 'Captioned image';
export const handle = 'captioned-image';
const image: Picture = createPicture({
  contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/10/featured-image-dans-blog2.jpg',
  caption: 'An edited frame from Animating the Body',
  width: 1380,
  height: 1104
});

export const context = { model: image, modifiers: [] };
export const variants = [
  { name: 'full', context: { model: image, modifiers: ['full'] } },
  { name: 'bleed', context: { model: image, modifiers: ['bleed'] } }
];
