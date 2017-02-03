import {createPicture} from '../model/picture';

export function getWpFeaturedImage(uri, images) {
  const i = findWpFeaturedImage(uri, images);
  // I wish we had options ;_;
  return i ? convertWpImageToMedia(i) : null;
}

function findWpFeaturedImage(uri, images) {
  const imagesArr = Object.keys(images).map(k => images[k]);
  return imagesArr.find(i => i.URL === uri);
}

function convertWpImageToMedia(wpImage) {
  return createPicture({
    contentUrl: wpImage.URL,
    caption: wpImage.caption,
    width: wpImage.width,
    height: wpImage.height
  });
}
