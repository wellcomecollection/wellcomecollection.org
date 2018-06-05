export function getWpFeaturedImage(uri: string, images: Object): ?CaptionedImage {
  const i = findWpFeaturedImage(uri, images);
  // I wish we had options ;_;
  return i ? convertWpImageToCaptionedImage(i) : null;
}

function findWpFeaturedImage(uri, images): ?Object {
  const imagesArr = Object.keys(images).map(k => images[k]);
  return imagesArr.find(i => i.URL === uri);
}

function convertWpImageToCaptionedImage(wpImage) {
  return {
    image: {
      contentUrl: wpImage.URL,
      width: wpImage.width,
      height: wpImage.height,
      alt: wpImage.alt,
      tasl: {}
    },
    caption: []
  };
}
