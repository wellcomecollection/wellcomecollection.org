// @flow
import type {Picture} from '../model/picture';
import {createPicture} from '../model/picture';

export function getWpFeaturedImage(uri: string, images: Object): ?Picture {
  const i = findWpFeaturedImage(uri, images);
  // I wish we had options ;_;
  return i ? convertWpImageToPicture(i) : null;
}

function findWpFeaturedImage(uri, images): ?Object {
  const imagesArr = Object.keys(images).map(k => images[k]);
  return imagesArr.find(i => i.URL === uri);
}

function convertWpImageToPicture(wpImage) {
  return createPicture({
    contentUrl: wpImage.URL,
    caption: wpImage.caption,
    alt: wpImage.alt,
    copyright: wpImage.description,
    width: wpImage.width,
    height: wpImage.height,
    type: 'picture'
  });
}
