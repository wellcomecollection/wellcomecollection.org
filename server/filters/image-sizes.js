import {OrderedSet} from 'immutable';

// We add 2048 as Wordpresses image service only supports image resizing up till then
const maxWidth = 2048;
export const supportedSizes = OrderedSet([160, 180, 282, 320, 420, 600, 880, 960, 1024, 1338, maxWidth]);

export function getImageSizesFor(image) {
  const { width } = image;
  return supportedSizes.add(width).filter(size => size <= width && size <= maxWidth).toJS();
}
