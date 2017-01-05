// TODO: This model needs to match Schema.org
// TODO: Maybe ImmutableJs Records?
export default class Media {
  // We use destructuring here as pseudo named arguments functionality
  constructor({
    mediaType,
    uri,
    mimetype,
    weighting,
    altText,
    filesize,
    title,
    author,
    caption,
    credit,
    copyright,
    dimensions
  }) {
    this.mediaType = mediaType;
    this.uri = uri;
    this.mimetype = mimetype;
    this.altText = altText;
    this.filesize = filesize;
    this.title = title;
    this.author = author;
    this.caption = caption;
    this.credit = credit;
    this.copyright = copyright;
    this.dimensions = dimensions;
    this.weighting = weighting;
  }
}

export function getWpFeaturedImage(uri, images) {
  const i = findWpFeaturedImage(uri, images);
  // I wish we had options ;_;
  console.info(convertWpImageToMedia(i));
  return i ? convertWpImageToMedia(i) : null;
}

function findWpFeaturedImage(uri, images) {
  const imagesArr = Object.keys(images).map(k => images[k]);
  return imagesArr.find(i => i.URL === uri);
}

function convertWpImageToMedia(wpImage) {
  return new Media({
    mediaType: 'image',
    weighting: 'leading',
    uri: wpImage.URL,
    mimetype: wpImage.mime_type,
    caption: wpImage.caption,
    altText: wpImage.alt,
    dimensions: { width: wpImage.width, height: wpImage.height }
  });
}
