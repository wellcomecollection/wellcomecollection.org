import {Set} from 'immutable';

export const supportedSizes = Set([300, 600, 960, 1338]);

export function getImageSizesFor(image) {
  const { width } = image;
  return supportedSizes.add(width).toJS();
}
