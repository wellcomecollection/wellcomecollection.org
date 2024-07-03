// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Moved this here so it could be isolated "ts-nochecks"
// As we expect these image links to NOT match their types in order to test them properly

import { getImageUrlAtSize } from './images';
import { imageWithoutCrops } from './images.mocks';

export const urlWithoutCrop = new URL(
  getImageUrlAtSize(imageWithoutCrops, { w: 600 })
);

export const urlOverridesPresetSearchParams = new URL(
  getImageUrlAtSize(
    {
      ...imageWithoutCrops,
      url: `${imageWithoutCrops.url}&width=123`,
    },
    { w: 1338 }
  ) as string
);

export const urlRemovesHParam = new URL(
  getImageUrlAtSize(
    {
      ...imageWithoutCrops,
      url: `${imageWithoutCrops.url}&h=123`,
    },
    { w: 1338 }
  ) as string
);
