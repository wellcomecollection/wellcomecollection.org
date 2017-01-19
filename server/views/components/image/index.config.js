import {Picture} from '../../../model/picture';

export const name = 'Image';
export const handle = 'Image';
const image = new Picture({
  contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/10/featured-image-dans-blog2.jpg',
  caption: 'An edited frame from Animating the Body',
  width: 1380,
  height: 1104
}).toJS();
const sizes = [300, 600, 960, 1338];
export const context = { image, sizes };
