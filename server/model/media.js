// @flow
import {type Picture, createPicture} from '../model/picture';

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
    width: wpImage.width,
    height: wpImage.height,
    type: 'picture'
  });
}
