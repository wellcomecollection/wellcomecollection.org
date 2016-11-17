export default class Article {
  constructor(headline, articleBody, mainImage, associatedMedia) {
    this.headline = headline;
    this.articleBody = articleBody;
    this.mainImage = mainImage;
    this.associatedMedia = associatedMedia;
    this.mainMedia = getMainMedia(associatedMedia);
  }

  static fromDrupalApi(json) {
    return new Article(json.headline, json.articleBody, json.mainImage, json.associatedMedia);
  }
}

function getMainMedia(associatedMedia) {
  // This is to make sure we don't serve the main image and the main video
  const video = associatedMedia.find(m => m.weighting === 'leading' && m.mediaType === 'video');
  const image = associatedMedia.find(m => m.weighting === 'leading' && m.mediaType === 'image');
  const audio = associatedMedia.find(m => m.weighting === 'leading' && m.mediaType === 'audio');

  return [(video || image), audio];
}
