import {Set} from 'immutable';

export const supportedSizes = Set([320, 420, 600, 880, 960, 1024, 1338]);

export function getImageSizesFor(image) {
  const { width } = image;
  return supportedSizes.add(width).toJS();
}
